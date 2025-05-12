// catalogo.js  (un solo archivo ► varias colecciones)
export const catalogos = {
  FLEX: {                            // la línea “vieja”
    folder: "/Fotos/WEBP/FLEX/",
    frameCount: 24,
    productos: [
      { id:"01", articulo:"JJ88718-4", color:"Black" },
      { id:"02", articulo:"JJ88718-4", color:"Beige"  },
      { id:"03", articulo:"JJ88718-8", color:"Off White" },
      { id:"04", articulo:"JJ88718-8", color:"Black"   },
      { id:"05", articulo:"JJ88718-13", color:"Black"   },
      { id:"06", articulo:"JJ88718-13", color:"Yellow"  },
      { id:"07", articulo:"JJ88572-18", color:"Beige"   },
      { id:"08", articulo:"JJ88572-18", color:"Black" },
      { id:"09", articulo:"JJ28279-1", color:"Off White" },
      { id:"10", articulo:"JJ28279-1", color:"Black" },
      { id:"11", articulo:"JJ28198-3", color:"Black" },
      { id:"12", articulo:"JJ28198-3", color:"Gold" },
      { id:"13", articulo:"JJ28198-1", color:"Gold" },
      { id:"14", articulo:"JJ28198-1", color:"Black" },
      { id:"15", articulo:"JJ88572-19", color:"Black" },
      { id:"16", articulo:"JJ88572-19", color:"Gold"  },
      { id:"17", articulo:"JJ9419-17", color:"Camel" },
      { id:"18", articulo:"JJ9419-17", color:"Black" },
      { id:"19", articulo:"JJ9825-5",  color:"Black" },
      { id:"20", articulo:"JJ9825-5",  color:"White" },
      { id:"21", articulo:"JJ88638-3", color:"Beige" },
      { id:"22", articulo:"JJ88638-3", color:"Black" },
      { id:"23", articulo:"JJ88718-5", color:"Black" },
      { id:"24", articulo:"JJ88718-5", color:"White"  },
      { id:"25", articulo:"JJ9912-5",  color:"Off White" },
      { id:"26", articulo:"JJ9912-5",  color:"Black" },
      { id:"27", articulo:"JJ88718-14", color:"White" },
      { id:"28", articulo:"JJ88718-14", color:"Black" },
      { id:"29", articulo:"JJ28270-6",  color:"Black" },
      { id:"30", articulo:"JJ28270-6",  color:"Camel" },
      { id:"31", articulo:"JJ28270-2A", color:"Black" },
      { id:"32", articulo:"JJ28270-2A", color:"Gold"  }
    ],
    /* 2) tabla Artículo ➜ Color ➜ Código interno  (antes “codigosInternos”) */
    codigos: {
      "JJ9825-5": { "Black": 22511, "White": 22512, "Black Total": 22531 },
      "JJ28198-3": { "Black": 22503, "Gold": 22504 },
      "JJ28270-2A": { "Black": 22523, "Gold": 22524 },
      "JJ88718-13": { "Black": 22497, "Yellow": 22498 },
      "JJ88718-4": { "Black": 22492, "Beige": 22493, "Black Total": 22530 },
      "JJ88572-19": { "Black": 22507, "Gold": 22508 },
      "JJ9419-17": { "Black": 22510, "Camel": 22509 },
      "JJ88718-14": { "Black": 22519, "White": 22520, "Black Total": 22529 },
      "JJ88718-8": { "Black": 22496, "Off White": 22494 },
      "JJ28270-6": { "Black": 22521, "Camel": 22522 },
      "JJ9912-5": { "Black": 22518, "Off White": 22517 },
      "JJ28279-1": { "Black": 22502, "Off White": 22501 },
      "JJ88638-3": { "Black": 22514, "Beige": 22513 },
      "JJ28198-1": { "Gold": 22505, "Black": 22506 },
      "JJ88572-18": { "Black": 22500, "Beige": 22499 },
      "JJ88718-5": { "White": 22516, "Black": 22515 }  
    },
    /* 3) Artículos que requieren elegir Black / Black Total */
    variantesBlackTotal: {
      "JJ9825-5":   ["Black","Black Total"],
      "JJ88718-14": ["Black","Black Total"],
      "JJ88718-4":  ["Black","Black Total"]
    }
  },
  NUEVA: {                           // colección nueva, 36 frames
    folder: "/Fotos/WEBP/NUEVA/",
    frameCount: 36,
    productos: [
      { id:"01", articulo:"NX100", color:"Camel", codigo:23001 },
      /* ... */
    ]
  }
};

/* función que usa cualquier HTML */
export function iniciarVisor(cfg, opciones){
  const { folder, frameCount, productos } = cfg;
  // aquí va tu buildCarousel, buildSourceArray, etc.
  // ahora leen frameCount y folder en vez de constantes globales
  // ...
  if (opciones.pedidos){
     // carga pedidoModule.js y muestra botones
  }
}
