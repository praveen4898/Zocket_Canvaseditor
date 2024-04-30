import React, { useEffect, useRef, useState } from 'react';
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

class Caption {
  constructor(context, text, position, maxCharactersPerLine, fontSize, alignment, textColor) {
    this.context = context;
    this.text = text;
    this.position = position;
    this.maxCharactersPerLine = maxCharactersPerLine;
    this.fontSize = fontSize;
    this.alignment = alignment;
    this.textColor = textColor;
  }

  splitText() {
    const lines = [];
    let currentLine = '';
    let remainingText = this.text.trim();

    while (remainingText.length > 0) {
      if (remainingText.length <= this.maxCharactersPerLine) {
        lines.push(remainingText);
        remainingText = '';
      } else {
        let lastSpaceIndex = remainingText.lastIndexOf(' ', this.maxCharactersPerLine);
        if (lastSpaceIndex === -1) {
          lastSpaceIndex = this.maxCharactersPerLine;
        }
        lines.push(remainingText.substring(0, lastSpaceIndex));
        remainingText = remainingText.substring(lastSpaceIndex).trim();
      }
    }

    return lines;
  }

  draw() {
    const { context, position, textColor, fontSize, alignment } = this;
    const maxCharactersPerLine = this.maxCharactersPerLine;
    const lines = this.splitText();

    context.fillStyle = textColor;
    context.font = `${fontSize}px Arial`;
    context.textAlign = alignment;

    lines.forEach((line, index) => {
      context.fillText(line, position.x, position.y + (index * fontSize));
    });
  }
}

class CTA {
  constructor(context, text, position, textColor, backgroundColor, font) {
    this.context = context;
    this.text = text;
    this.position = position;
    this.textColor = textColor;
    this.backgroundColor = backgroundColor;
    this.font = font;
  }

  draw() {
    const { context, position, text, textColor, font, backgroundColor } = this;
    const textMetrics = context.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = parseInt(font, 10);

    context.fillStyle = 'white';
    context.fillRect(position.x, position.y - textHeight + 8, textWidth - 50, textHeight);

    context.fillStyle = textColor;
    context.font = font;
    context.fillText(text, position.x, position.y);
  }
}

function App() {
  const canvasRef = useRef(null);
  const [image, setImage] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgQ0wtOo5hGvB2i9EIB6Q4BGAJcm593kDwWg&s");
  const [caption, setCaption] = useState(styledata.caption.text);
  const [ctaText, setCtaText] = useState(styledata.cta.text);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [pickedColors, setPickedColors] = useState([]);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

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

        const captionObj = new Caption(
          context,
          caption,
          styledata.caption.position,
          styledata.caption.max_characters_per_line,
          styledata.caption.font_size,
          'left',
          styledata.caption.text_color
        );
        captionObj.draw();

        const ctaObj = new CTA(
          context,
          ctaText,
          styledata.cta.position,
          backgroundColor,
          styledata.cta.background_color,
          "30px Arial"
        );
        ctaObj.draw();
      };
    }
  }, [image, backgroundColor, caption, ctaText]);

  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
  };

  const handleCtaTextChange = (event) => {
    setCtaText(event.target.value);
  };

  const handleBackgroundColorChange = (color) => {
    setBackgroundColor(color.hex);
    setPickedColors([...pickedColors.slice(-4), color.hex]);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleColorPick = (color) => {
    setPickedColors([...pickedColors.slice(-4), color.hex]);
    setBackgroundColor(color.hex);
    setShowColorPicker(false);
  };

  const gridStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const lineStyle = {
    flex: "1",
    borderBottom: "1px solid",
    margin: "0 10px",
  };

  return (
    <>
      <div className='flex justify-around my-12 '>
        <div className=' flex justify-center'>
          <canvas ref={canvasRef} width={1080} height={1080} className="w-3/6"></canvas>
        </div>

        <div className='flex flex-col justify-around w-3/6 px-8'>
          <div >
            <h1 className='font-bold text-center'>Ad Customization</h1>
            <h3 className='text-center'>Customise your ad and the get the templates accordingly</h3>
          </div>
          <div>
            <h2 className='font-bold'>Change the creative Image</h2>
            <input type="file" onChange={handleImageUpload} className=' rounded-md p-2 w-half' />
          </div>

          <div className="text-sm font-sans text-gray-500 text-center mt-5" style={gridStyle}>
            <hr style={lineStyle} />
            <span>Edit contents</span>
            <hr style={lineStyle} />
          </div>

          <div>
            <h2 className='font-bold'>Ad Content</h2>
            <input type="text" placeholder='Enter Caption' value={caption} onChange={handleCaptionChange} className='border border-gray-300 rounded-md p-2 w-half' />
          </div>

          <div>
            <h2 className='font-bold'>CTA</h2>
            <input type="text" placeholder='Enter CTA' value={ctaText} onChange={handleCtaTextChange} className='border border-gray-300 rounded-md p-2 w-half' />
          </div>

          <div className="mt-4">
            <h2 className='font-bold'>Choose your color</h2>
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
    </>
  )
}

export default App;






















