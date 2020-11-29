import React from "react";

import image from "./assets/Macaca_nigra_self-portrait_large.jpg";
import imageSrcSetWebp from "./assets/Macaca_nigra_self-portrait_large.jpg?srcset&format=webp&quality=100";
import imageSrcSet from "./assets/Macaca_nigra_self-portrait_large.jpg?srcset&quality=100";

function App() {
  return (
    <div>
      <img style={{ width: "50vw" }} srcSet={imageSrcSet} src={image} />

      {/* for modern browsers: */}
      <picture>
        <source type="image/webp" srcSet={imageSrcSetWebp} />
        <source type="image/jpeg" srcSet={imageSrcSet} />
        <img style={{ width: "50vw" }} src={image} />
      </picture>
    </div>
  );
}

export default App;
