import { useEffect, useRef, useState } from 'react';
import './App.css';

const styledata = {
  caption: {
    text: "1 & 2 BHK Luxury Apartments at just Rs.34.97Lakhs",
    position: { x: 50, y: 50 },
    max_characters_per_line: 31,
    font_size: 44,
    alignment: "left",
    text_color: "#FFFFFF"
  },
  cta: {
    text: "Shop Now",
    position: { x: 190, y: 320 },
    text_color: "#FFFFFF",
    background_color: "#000000"
  },
  image_mask: { x: 56, y: 442, width: 970, height: 600 },
  urls: {
    mask: "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_mask.png",
    stroke: "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Mask_stroke.png",
    design_pattern: "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Design_Pattern.png"
  }
};

function App() {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState(styledata.caption.text);
  const [ctaText, setCtaText] = useState(styledata.cta.text);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  useEffect(() => {
    console.log("useEffect triggered");
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    //canvas
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, 1080, 1080);
    context.clearRect(0, 700, 1080, 1080);

    if (image) {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const x = styledata.image_mask.x;
        const y = styledata.image_mask.y;
        const imgwidth = styledata.image_mask.width;
        const imgheight = styledata.image_mask.height;

        context.drawImage(img, x, y, imgwidth, imgheight);

       //cta function to split

        function splitText(text, maxCharactersPerLine) {
          const lines = [];
          let currentLine = '';
          let remainingText = text.trim();
        
          while (remainingText.length > 0) {
            if (remainingText.length <= maxCharactersPerLine) {
              lines.push(remainingText);
              remainingText = '';
            } else {
              let lastSpaceIndex = remainingText.lastIndexOf(' ', maxCharactersPerLine);
              if (lastSpaceIndex === -1) {
                lastSpaceIndex = maxCharactersPerLine;
              }
              lines.push(remainingText.substring(0, lastSpaceIndex));
              remainingText = remainingText.substring(lastSpaceIndex).trim();
            }
          }
        
          return lines;
        }
        


        context.fillStyle = styledata.caption.text_color;
        const maxCharactersPerLine = styledata.caption.max_characters_per_line;
        const captionLines = splitText(caption, maxCharactersPerLine);
        const capx = styledata.caption.position.x;
        let capy = styledata.caption.position.y;
        context.font = `${styledata.caption.font_size}px Arial`;
        context.textAlign = "left";
        captionLines.forEach((line, index) => {
          context.fillText(line, capx, capy + (index * styledata.caption.font_size));
        });

        
//cta
const CTAText = ctaText;
const ctaFont = "30px Arial";
const ctax = styledata.cta.position.x;
const ctay = styledata.cta.position.y;

// Measure the width and height of the CTA text
const textMetrics = context.measureText(ctaText);
const textWidth = textMetrics.width;
const textHeight = parseInt(ctaFont, 10); 

// to Set background color
context.fillStyle = styledata.cta.background_color; 

// to Draw background rectangle
context.fillRect(ctax, ctay - textHeight+8, textWidth, textHeight);

// Set text color
context.fillStyle = styledata.cta.text_color;

// Draw CTA text
context.font = ctaFont;
context.fillText(CTAText, ctax, ctay);

      };
    }
  }, [image, backgroundColor,caption,ctaText]);

  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
  };

  const handleCtaTextChange = (event) => {
    setCtaText(event.target.value);
  };

  const handleBackgroundColorChange = (event) => {
    setBackgroundColor(event.target.value);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      console.log("Image loaded successfully");
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
    <div className='flex gap-10 justify-center'>
            <div>
        <canvas ref={canvasRef} width={1080} height={1080} ></canvas>
      </div>


      <div>
        <div>
        <h2>Choose Image</h2>

        <input type="file" onChange={handleImageUpload} />
        </div>
       
       <div>
       <h2>Choose Caption</h2>

        <input type="text" placeholder='Enter Caption' value={caption} onChange={handleCaptionChange} />
        </div>

<div>
<h2>Choose CTA</h2>

        <input type="text" placeholder='Enter CTA' value={ctaText} onChange={handleCtaTextChange} />
        </div>


        <div >
          <h2>Choose Background color</h2>
        <input type="color" value={backgroundColor} onChange={handleBackgroundColorChange} />
        </div>
      </div>


      </div>

    </>
  )
}

export default App;




