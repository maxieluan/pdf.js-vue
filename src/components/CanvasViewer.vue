<template>
  <canvas id="theCanvas"></canvas>
  <div class="page-nav">
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
import "pdfjs-dist/web/pdf_viewer.css";

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
    };
  },
  mounted() {
    this.getPdf();
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
      const canvas = document.getElementById("theCanvas");
      const context = canvas.getContext("2d");
      const scale = 1.5;
      this.loadingTask.promise.then((pdf) => {
        pdf.getPage(num).then((page) => {
          const viewport = page.getViewport({ scale });
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          page.render(renderContext);
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
div.page {
  display: inline-block;
}
</style>