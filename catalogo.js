/* catalogo.js  ► varias colecciones reformateado: productos como objeto */
window.catalogos = {
  FLEX: {
    folder: "Fotos/WEBP/FLEX/",
    extension: ".webp",
    frameCount: 24,

    /* 1) orden del carrusel → objeto id → { article, color } */
    productos: {
      "01": { article: "JJ88718-4",  color: "Black" },
      "02": { article: "JJ88718-4",  color: "Beige" },
      "03": { article: "JJ88718-8",  color: "Off White" },
      "04": { article: "JJ88718-8",  color: "Black" },
      "05": { article: "JJ88718-13", color: "Black" },
      "06": { article: "JJ88718-13", color: "Yellow" },
      "07": { article: "JJ88572-18", color: "Beige" },
      "08": { article: "JJ88572-18", color: "Black" },
      "09": { article: "JJ28279-1",  color: "Off White" },
      "10": { article: "JJ28279-1",  color: "Black" },
      "11": { article: "JJ28198-3",  color: "Black" },
      "12": { article: "JJ28198-3",  color: "Gold" },
      "13": { article: "JJ28198-1",  color: "Gold" },
      "14": { article: "JJ28198-1",  color: "Black" },
      "15": { article: "JJ88572-19", color: "Black" },
      "16": { article: "JJ88572-19", color: "Gold" },
      "17": { article: "JJ9419-17",  color: "Camel" },
      "18": { article: "JJ9419-17",  color: "Black" },
      "19": { article: "JJ9825-5",   color: "Black" },
      "20": { article: "JJ9825-5",   color: "White" },
      "21": { article: "JJ88638-3",  color: "Beige" },
      "22": { article: "JJ88638-3",  color: "Black" },
      "23": { article: "JJ88718-5",  color: "Black" },
      "24": { article: "JJ88718-5",  color: "White" },
      "25": { article: "JJ9912-5",   color: "Off White" },
      "26": { article: "JJ9912-5",   color: "Black" },
      "27": { article: "JJ88718-14", color: "White" },
      "28": { article: "JJ88718-14", color: "Black" },
      "29": { article: "JJ28270-6",  color: "Black" },
      "30": { article: "JJ28270-6",  color: "Camel" },
      "31": { article: "JJ28270-2A", color: "Black" },
      "32": { article: "JJ28270-2A", color: "Gold" }
    },

    /* 2) tabla Artículo ➜ Color ➜ Código interno */
    codigos: {
      "JJ9825-5":   { "Black": 22511, "White": 22512, "Black Total": 22531 },
      "JJ28198-3":  { "Black": 22503, "Gold": 22504 },
      "JJ28270-2A": { "Black": 22523, "Gold": 22524 },
      "JJ88718-13": { "Black": 22497, "Yellow": 22498 },
      "JJ88718-4":  { "Black": 22492, "Beige": 22493, "Black Total": 22530 },
      "JJ88572-19": { "Black": 22507, "Gold": 22508 },
      "JJ9419-17":  { "Black": 22510, "Camel": 22509 },
      "JJ88718-14": { "Black": 22519, "White": 22520, "Black Total": 22529 },
      "JJ88718-8":  { "Black": 22496, "Off White": 22494 },
      "JJ28270-6":  { "Black": 22521, "Camel": 22522 },
      "JJ9912-5":   { "Black": 22518, "Off White": 22517 },
      "JJ28279-1":  { "Black": 22502, "Off White": 22501 },
      "JJ88638-3":  { "Black": 22514, "Beige": 22513 },
      "JJ28198-1":  { "Gold": 22505, "Black": 22506 },
      "JJ88572-18": { "Black": 22500, "Beige": 22499 },
      "JJ88718-5":  { "White": 22516, "Black": 22515 }
    },

    /* 3) Artículos que requieren elegir Black / Black Total */
    variantesPorColor: {
      "JJ9825-5": {"Black": [ "Black Total"]},
      "JJ88718-14": {"Black": [ "Black Total"]},
      "JJ88718-4": {"Black": [ "Black Total"]}
      }
  },

  /* ——— LÍNEA NUEVA (36 frames) ——— */
  BIRK_OJOTA: {
    folder: "Fotos/JPG/BIRK_OJOTA/",
    extension: ".jpg",
    frameCount: 36,

    /* 1) orden del carrusel → objeto id → { article, color } */
    productos: {
      "01": { article: "301-1891-3",  color: "Black" },
      "02": { article: "301-1891-3",  color: "Beige" },
      "03": { article: "301-1891-4",  color: "Black" },
      "04": { article: "301-1891-4",  color: "Silver" },
      "05": { article: "301-1891-4",  color: "Gold" },
      "06": { article: "301-1891-2",  color: "Black" },
      "07": { article: "301-1891-2",  color: "White" },
      "08": { article: "301-1891-2",  color: "Beige" },
      "09": { article: "301-1891-1",  color: "Black" },
      "10": { article: "301-1891-1",  color: "Beige" },
      "11": { article: "301-1891-1",  color: "Light Blue" },
      "12": { article: "301-1891B-5", color: "Black" },
      "13": { article: "301-1891B-5", color: "Gold" },
      "14": { article: "301-1891B-5", color: "Silver" },
      "15": { article: "301-2361-19", color: "Black" },
      "16": { article: "301-2361-19", color: "Gold" },
      "17": { article: "301-2361-19", color: "Silver" },
      "18": { article: "301-2361-8",  color: "Black" },
      "19": { article: "301-2361-8",  color: "Beige" },
      "20": { article: "301-2361-8",  color: "White" },
      "21": { article: "301-2461-1",  color: "Black" },
      "22": { article: "301-2461-1",  color: "Beige" },
      "23": { article: "301-2461-1",  color: "Silver" },
      "24": { article: "301-2461-1",  color: "Gold" },
      "25": { article: "301-2462-1",  color: "Black" },
      "26": { article: "301-2462-1",  color: "Beige" },
      "27": { article: "301-2462-1",  color: "Gold" },
      "28": { article: "301-2462-1",  color: "Silver" }
    },

    /* 2) Artículo ➜ Color ➜ Código interno */
    codigos: {
      "301-1891-3":  { "Black":22565, "Beige":22566 },
      "301-1891-4":  { "Black":22567, "Silver":22569, "Gold":22568 },
      "301-1891-2":  { "Black":22558, "White":22560, "Beige":22561 },
      "301-1891-1":  { "Black":22562, "Beige":22564, "Light Blue":22563 },
      "301-1891B-5": { "Black":22555, "Gold":22556, "Silver":22557 },
      "301-2361-19": { "Black":22549, "Gold":22551, "Silver":22550 },
      "301-2361-8":  { "Black":22552, "Beige":22553, "White":22554 },
      "301-2461-1":  { "Black":22542, "Beige":22541, "Silver":22543, "Gold":22544, "Black Animal":22571, "Beige Animal":22573, "White Animal":22572 },
      "301-2462-1":  { "Black":22545, "Beige":22546, "Gold":22548, "Silver":22547 }
    },

    /* 3) Esta línea no tiene “Black Total” */
    variantesPorColor: {
      "301-2461-1": {"Black": ["Black Animal"],
                     "Beige": ["Beige Animal", "White Animal"]}
     }
  }
};

/* ─── helpers globales ────────────────────────── */
window.getProducto = function(linea, id){
  const cat = catalogos[linea];
  return cat ? cat.productos[id] : null;
}
window.getCodigo = function(linea, art, color){
  return catalogos[linea]?.codigos?.[art]?.[color] ?? null;
}
