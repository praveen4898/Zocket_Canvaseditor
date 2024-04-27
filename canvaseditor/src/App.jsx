import { useEffect, useRef, useState } from 'react';
import './App.css';
import { ChromePicker } from 'react-color';
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
  const [image, setImage] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgQ0wtOo5hGvB2i9EIB6Q4BGAJcm593kDwWg&s");
  const [caption, setCaption] = useState(styledata.caption.text);
  const [ctaText, setCtaText] = useState(styledata.cta.text);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [pickedColors, setPickedColors] = useState([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [initialLaunch, setInitialLaunch] = useState(true);
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
  const handleBackgroundColorChange = (color) => {
    setBackgroundColor(color.hex);
    if (initialLaunch) {
      setInitialLaunch(false);
    } else {
      setPickedColors([...pickedColors.slice(-4), color.hex]);
    }
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

  const handleColorPick = (color) => {
    setPickedColors([...pickedColors.slice(-4), color.hex]);
    setShowColorPicker(false);
  };
  return (
    <>
      <div className='flex justify-around my-12 bg-orange-200'>
        <div className='border-2 border-black-600 flex justify-center'>
          <canvas ref={canvasRef} width={1080} height={1080} className="w-3/6"></canvas>
        </div>

        <div className='flex flex-col border-2 border-black-600 justify-around w-3/6 px-8'>
          <div>
            <h2>Choose Image</h2>
            <input type="file" onChange={handleImageUpload} className='border border-gray-300 rounded-md p-2 w-half' />
          </div>

          <div>
            <h2>Choose Caption</h2>
            <input type="text" placeholder='Enter Caption' value={caption} onChange={handleCaptionChange} className='border border-gray-300 rounded-md p-2 w-half' />
          </div>

          <div>
            <h2>Choose CTA</h2>
            <input type="text" placeholder='Enter CTA' value={ctaText} onChange={handleCtaTextChange} className='border border-gray-300 rounded-md p-2 w-half' />
          </div>

          <div>
            <h2>Choose Background color</h2>
            <input type="color" value={backgroundColor} onChange={(event) => handleBackgroundColorChange(event.target.value)} />
          </div>

          <div className="mt-4">
            <h2>Last 5 Picked Colors</h2>
            <div className="flex">
              {pickedColors.map((color, index) => (
                <div
                  key={index}
                  className="w-8 h-8 mr-2 cursor-pointer border border-gray-300 rounded-full"
                  style={{ backgroundColor: color }}
                  onClick={() => setBackgroundColor(color)}
                ></div>
              ))}
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-8 h-8 flex items-center justify-center bg-gray-300 border border-gray-400 rounded-full cursor-pointer"
              >
                +
              </button>
            </div>
            {showColorPicker && (
              <div className="mt-2">
                <ChromePicker color={backgroundColor} onChangeComplete={handleColorPick} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>  )
}

export default App;















