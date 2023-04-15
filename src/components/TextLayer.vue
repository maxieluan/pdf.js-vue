<template>
  <div id="container"><canvas id="theCanvas"></canvas></div>
  <div class="page-nav" :style="{ top: pageNavTop }">
    <button @click="prev">prev</button>
    <span>{{ currentPage }}/ {{ numPages }} </span>
    <button @click="next">next</button>
    <input
      type="number"
      v-model="selectedPage"
      @input="gotoSelectedPage"
      min="1"
      max="numPages"
    />
  </div>
</template>
  
<script>
import * as pdfjsLib from "pdfjs-dist/build/pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.5.141/build/pdf.worker.min.js";

export default {
  name: "PdfViewer",
  data() {
    return {
      loadingTask: null,
      currentPage: 1,
      numPages: 0,
      selectedPage: 1,
      canvasHeight: 0,
    };
  },
  mounted() {
    this.getPdf();
  },
  computed: {
    pageNavTop() {
      var v = this.canvasHeight + 40;
      return `${v}px`;
    },
  },
  methods: {
    async getPdf() {
      const pdfUrl = "./sample.pdf"; // Replace with the URL or file path of your PDF
      this.loadingTask = pdfjsLib.getDocument(pdfUrl);
      this.loadingTask.promise.then((pdf) => {
        this.numPages = pdf.numPages;
        this.renderPage(this.currentPage);
      });
    },
    renderPage(num) {
      const container = document.getElementById("container");
      const canvas = document.getElementById("theCanvas");
      const context = canvas.getContext("2d");
      const scale = 1.5;
      this.loadingTask.promise.then((pdf) => {
        pdf
          .getPage(num)
          .then((page) => {
            const viewport = page.getViewport({ scale });
            const textlayer = document.createElement("div");
            textlayer.className = "textLayer";
            container.appendChild(textlayer);

            canvas.height = viewport.height;
            canvas.width = viewport.width;
            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };
            const renderTask = page.render(renderContext);

            page.getTextContent().then((textContent) => {
              pdfjsLib.renderTextLayer({
                textContentSource: textContent,
                container: textlayer,
                viewport: viewport,
                textDivs: [],
              });
            });

            return renderTask.promise;
          })
          .then(() => {
            const canvas = document.getElementById("theCanvas");
            this.canvasHeight = canvas.offsetHeight;
          });
      });
    },
    next() {
      if (this.currentPage < this.numPages) {
        this.currentPage++;
        this.renderPage(this.currentPage);
      }
    },
    prev() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.renderPage(this.currentPage);
      }
    },
    gotoSelectedPage() {
      if (this.selectedPage >= 1 && this.selectedPage <= this.numPages) {
        this.currentPage = this.selectedPage;
        this.renderPage(this.currentPage);
      }
    },
  },
};
</script>
  
<style>
.page-nav {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
}

div#container {
  position: absolute;
  --scale-factor: 1.5;
  left: 50%;
  transform: translate(-50%, 0);
}

.textLayer {
  position: absolute;
  text-align: initial;
  inset: 0;
  overflow: hidden;
  opacity: 0.25;
  line-height: 1;
  text-size-adjust: none;
  forced-color-adjust: none;
  transform-origin: 0 0;
  z-index: 2;
}

.textLayer span,
.textLayer br {
  color: transparent;
  position: absolute;
  white-space: pre;
  cursor: text;
  transform-origin: 0% 0%;
}

/* Only necessary in Google Chrome, see issue 14205, and most unfortunately
 * the problem doesn't show up in "text" reference tests. */
.textLayer span.markedContent {
  top: 0;
  height: 0;
}

.textLayer .highlight {
  margin: -1px;
  padding: 1px;
  background-color: var(--highlight-bg-color);
  border-radius: 4px;
}

.textLayer .highlight.appended {
  position: initial;
}

.textLayer .highlight.begin {
  border-radius: 4px 0 0 4px;
}

.textLayer .highlight.end {
  border-radius: 0 4px 4px 0;
}

.textLayer .highlight.middle {
  border-radius: 0;
}

.textLayer .highlight.selected {
  background-color: var(--highlight-selected-bg-color);
}

.textLayer ::selection {
  /*#if !MOZCENTRAL*/
  background: blue;
  /*#endif*/
  background: AccentColor;
}

/* Avoids https://github.com/mozilla/pdf.js/issues/13840 in Chrome */
.textLayer br::selection {
  background: transparent;
}

.textLayer .endOfContent {
  display: block;
  position: absolute;
  inset: 100% 0 0;
  z-index: -1;
  cursor: default;
  user-select: none;
}

.textLayer .endOfContent.active {
  top: 0;
}

div.page {
  display: inline-block;
}
</style>