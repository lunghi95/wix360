$(function(){
    const baseURL = "https://raw.githubusercontent.com/lunghi95/wix360/refs/heads/main/";
    const folder = "Fotos/JPG/";
    const frameCount = 24;
    let currentProduct = 1;
  
    initViewer(currentProduct);
    buildCarousel(32);
  
    // ------------------- INIT VIEWER ------------------- //
    function initViewer(productNum){
      $("#loadingSpinner").show();
  
      if ($("#mySpin").data("spritespin")){
        $("#mySpin").spritespin("destroy");
      }
      $("#mySpin").empty();
  
      const images = buildSourceArray(productNum);
      preloadImages(images, function(allOk){
        if (!allOk) {
          console.warn("Faltó alguna imagen en producto", productNum);
        } else {
          console.log("Cargadas OK producto", productNum);
        }
  
        $("#mySpin").spritespin({
          source: images,
          renderer: 'image',
          crossOrigin: 'anonymous',
          responsive: true,
          animate: true,
          loop: true,
          frameTime: 150,
          sense: -1,
          onFrame: function(e, data){
            const current = data.frame + 1;
            const total = data.frames;
            $("#frameCounter").text(`${current} de ${total}`);
          },
          onDragStart: function(e, data){
            data.instance.stopAnimation();
          }
        });
        $("#loadingSpinner").hide();
        
        // Actualizar título (Artículo + Color)
        updateProductTitle(productNum);
  
        const spinAPI = $("#mySpin").spritespin("api");
        $("#reanudarBtn").off("click").on("click", function(){
          if (spinAPI && typeof spinAPI.startAnimation === 'function'){
            spinAPI.startAnimation();
          }
        });
      });
    }
  
    // ------------------- BUILD CAROUSEL ------------------- //
    function buildCarousel(numProd){
      const $c = $("#carouselContainer");
      $c.empty();
  
      for (let p=1; p<=numProd; p++){
        const pStr = p<10 ? "0"+p : p;
        const thumbURL = `${baseURL}${folder}Producto_${pStr}_F01.jpg`;
        const $img = $('<img class="miniature" />').attr('src', thumbURL);
  
        $img.data('product', p);
        if (p === currentProduct) $img.addClass("selected");
  
        $img.on("click", function(){
          $(".miniature").removeClass("selected");
          $(this).addClass("selected");
          currentProduct = $(this).data("product");
          console.log("Selected product:", currentProduct);
          initViewer(currentProduct);
        });
        
        // ===== NUEVO: creamos wrapper y label =====
        const $wrapper = $('<div class="miniWrapper"></div>').append($img);
        const info = productInfo[pStr];
        if (info) {
          const $label = $('<div class="miniArticleLabel"></div>').text(info.article);
          $wrapper.append($label);
        }
  
        // En lugar de $c.append($img), hacemos:
        $c.append($wrapper);
      }
  
      // Rueda => scroll vertical/horizontal según orientation
      $c.on("wheel", function(e){
        e.preventDefault();
        const isLandscape = window.matchMedia("(orientation: landscape)").matches;
        if (isLandscape) {
          this.scrollTop += e.originalEvent.deltaY;
        } else {
          this.scrollLeft += e.originalEvent.deltaY;
        }
      });
    }
  
    // Actualiza el título con Artículo y Color usando productInfo.js
    function updateProductTitle(prodNum){
      // Convertir a string con zero-padding
      const pStr = prodNum<10 ? "0"+prodNum : String(prodNum);
      // Leer la info del diccionario
      const info = productInfo[pStr];
      if (info) {
        const { article, color } = info;
        document.getElementById("productTitle").textContent = article + " " + color;
      } else {
        document.getElementById("productTitle").textContent = "";
      }
    }
  
    // ------------------- UTILS ------------------- //
    function buildSourceArray(prodNum){
      const images = [];
      const pStr = prodNum<10 ? "0"+prodNum : prodNum;
      for (let i=1; i<=frameCount; i++){
        const fStr = i<10 ? "0"+i : i;
        images.push(`${baseURL}${folder}Producto_${pStr}_F${fStr}.jpg`);
      }
      return images;
    }
  
    function preloadImages(urls, cb){
      let loaded = 0;
      let fail = false;
      urls.forEach(url=>{
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = ()=>{
          loaded++;
          if (loaded===urls.length) cb(!fail);
        };
        img.onerror=()=>{
          console.error("(×) Falló:", url);
          fail=true; loaded++;
          if (loaded===urls.length) cb(!fail);
        };
        img.src=url;
      });
    }
  
    // ------------------- ZOOM TÁCTIL ------------------- //
    let initialDistance = 0;
    let scale = 1;
    let initialMidpoint = { x: 0, y: 0 };
  
    $("#mySpin").on("touchstart", function(e){
      if (e.touches.length === 2) {
        initialDistance = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        initialMidpoint = {
          x: (e.touches[0].pageX + e.touches[1].pageX) / 2,
          y: (e.touches[0].pageY + e.touches[1].pageY) / 2
        };
      }
    });
  
    $("#mySpin").on("touchmove", function(e){
      if (e.touches.length === 2) {
        const currentDistance = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        const delta = currentDistance / initialDistance;
        scale *= delta;
        initialDistance = currentDistance;
  
        const currentMidpoint = {
          x: (e.touches[0].pageX + e.touches[1].pageX) / 2,
          y: (e.touches[0].pageY + e.touches[1].pageY) / 2
        };
  
        // Mantener la posición inicial para evitar la rotación lateral
        const translateX = 0;
        const translateY = currentMidpoint.y - initialMidpoint.y;
  
        $(this).css("transform", `scale(${scale}) translate(${translateX}px, ${translateY}px)`);
      }
    });
  
    $("#mySpin").on("touchend", function(e){
      if (e.touches.length < 2) {
        initialDistance = 0;
        // Restablecer el zoom al soltar los dedos
        $(this).css("transform", `scale(1) translate(0, 0)`);
        scale = 1;
      }
    });
  
    // Desactivar el zoom en el carrusel
    $("#carouselContainer").on("touchstart touchmove", function(e){
      if (e.touches.length === 2) {
        e.preventDefault();
      }
    });
  
    // Deshabilitar la selección de texto y el clic derecho en toda la página
    $(document).on('contextmenu', function(e) {
        e.preventDefault();
      });
  
      $(document).on('selectstart', function(e) {
        e.preventDefault();
      });
  
  });