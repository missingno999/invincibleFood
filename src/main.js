import './style.css'
import * as htmlToImage from 'html-to-image';
import { toPng, toCanvas} from 'html-to-image';
//use an event listener to get data from input, and update image src property

//`data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><text x='0' y='50' font-family='invinc'>${element.value}</text></svg>`

document.querySelector('#app').innerHTML = `
     <div style="width:fit-content;" class="controlsDive">
          <input id="userText" type="text" placeholder="Edit text here" autocomplete="off">
          <button id="download">Render it!</button>
     </div>
     <div style="width:fit-content;" class="controlsDive">
          <label for="bodyColor">Body Color</label>
          <input id="bodyColor" type="color" value="#b51616"/>
          <label for="fontColor">Font Color</label>
          <input id="fontColor" type="color" value="#fcfcf1">
     </div>
     <canvas id="imageText" width="1036" height="1036"></canvas>
     <div id="playingField" class="standard">
          <div id="renderableDiv1">
               <div id="renderableDiv2">
                    <svg id="NNNN" xmlns='http://www.w3.org/2000/svg' viewBox="0 0 1036 1036" preserveAspectRatio="xMidYMidmeet">
                    <filter id="bend">
                         <!--<path id="patth" stroke="red" fill="red" d="M 0 50 A 1 6 90 1 1 550 50 L 550 0 A 1 6 90 1 0 0 0 z"></path>-->
                         <feImage result="goods"  height="100%" preserveAspectRatio="none" id="imageFilter"/>
                         <feDisplacementMap in="SourceGraphic" in2="goods" xChannelSelector="B" yChannelSelector="R" scale="50" y="0"  height="100%" preserveAspectRatio="none"/>
                    </filter>
                    <!--<rect x='0' y='0' width="700px" height="700px" filter="url(#bend)"/>-->
                         <image x='-10px' y='0px' id="prerender"></image>
                         <text id="editText" x='67px' y='570px' font-family='invinc' textLength="880px" text-anchor="start" lengthAdjust="spacingAndGlyphs" filter="url(#bend)">
                         </text>
                         <text x='410px' y='630px' font-size="20px" font-family="subtext" style="fill: rgb(252, 252, 241);" class="subtext">
                              BASED ON THE COMIC BOOK BY
                         </text>
                         <text x='359px' y='660px' font-size="20px" font-family="subtext" style="fill: rgb(252, 252, 241);" class="subtext">
                              Robert Kirkman, Cory Walker & Ryan Ottley
                         </text>
                    </svg>
               </div>
          </div>
     </div>
     <div id="displayScreen" class="close">
          <button id="close">
               X
          </button>
          <p>
               Right click to download the image!
          </p>
          <div id="frame">
               <img id="rendered"></img>
          </div>
     </div>
`

let tempNode=null;
//One time initial set up of event listeners and global resources
function setuppp(){
     //Procedurally generated gradient image generated at inital load, and then stored to the SVG image filter, for use with the displacement flter
     let varr=new OffscreenCanvas(1295,1295);
     let contexty=varr.getContext('2d');
     let gradient=contexty.createLinearGradient(0,0,1295,0);
     gradient.addColorStop(0, "rgb(127,0,0)");
     gradient.addColorStop(0.25, "rgb(206.375,0,0)");
     gradient.addColorStop(0.45, "red");
     gradient.addColorStop(0.55, "red");
     gradient.addColorStop(0.8, "rgb(206.375,0,0)");
     gradient.addColorStop(1, "rgb(127,0,0)");
     contexty.fillStyle = gradient;
     contexty.fillRect(0,0,1295,1295);
     varr.convertToBlob().then(
          (blob)=>{document.querySelector('#imageFilter').setAttribute('href',`${URL.createObjectURL(blob)}`);
     });

     //The SVG preview text/user string updater
     let element=document.querySelector('#userText');
     element.addEventListener("keyup",
     (e)=>{
          let text=document.getElementById("editText");//Get the SVG text element
          text.innerHTML=document.querySelector('#userText').value.toLowerCase();//Copy the text value from the input over
          //The resize the the size of the text according to the length of the input
          text.style["font-size"]=(document.querySelector('#userText').value.length>6 ? `${(660/document.querySelector('#userText').value.length)*(500/110)}px` : "500px")
     });

     //The event for rendering the SVG to a PNG
     element=document.querySelector('#download');
     element.addEventListener("click",
     ()=>{
          document.querySelector('#playingField').className="rendering";//Resize the relevant HTMLnodes so that the generated image's resolution is correct
          tempNode=document.querySelector('#editText').cloneNode(true);//Obatain a clone of the SVG user edited text. The SVG to PNG functino doesn't apply filters correctly, so were's gonna swap some stuff out
          let newElement = document.createElement('image');//Create the image element when text wil be held and used for the png
          newElement.setAttribute('id',"dummy");
          document.querySelector('#editText').replaceWith(newElement);//replace the SVG text with the new image element
          let contexty=document.getElementById("imageText").getContext('2d');//Draw the text to a canvas, which will then be converted to an image blob
          contexty.textAlign="center";
          contexty.fillStyle=document.querySelector("#fontColor").value;
          contexty.filter="url(#bend)";
          contexty.font =`${document.querySelector('#userText').value.length>6 ? `${(660/document.querySelector('#userText').value.length)*(500/110)}px` : "500px"} invinc`;
          contexty.fillText(document.querySelector('#userText').value.toLowerCase(),518,550);
          document.getElementById("imageText").toBlob((blob)=>{
               document.querySelector('#prerender').setAttribute('href',URL.createObjectURL(blob));
          },'image/png')
          //THIS FUNCTION CONTINUES IN THE LOAD EVENT FOR #prerender!
          //This is due to an bug when some updates would be applied out of order, so waiting for the the image text to load acts like a multithread control device
          contexty.reset();//Rest the canvas
     });

     //The event for rendering the SVG to a PNG part 2, and clean up
     document.querySelector("#prerender").addEventListener("load",
     ()=>{
          htmlToImage.toPng(document.querySelector('#playingField'))//Render the PNG
          .then((dataUrl) => {
               document.querySelector('#rendered').src = dataUrl;//display PNG
               document.querySelector('#displayScreen').className="open";
               document.querySelector('#playingField').className="standard";//clean up SVG
               document.querySelector('#prerender').setAttribute('href','');
               document.querySelector('#dummy').replaceWith(tempNode);
          })
          .catch((err) => {
               console.error('oops, something went wrong!', err);
          });
     });

     //Closes the rendered images displayScreen
     document.querySelector('#close').addEventListener("click",
     ()=>{
          let elementP=document.querySelector('#displayScreen');
          elementP.className="close";
     });

     //color input updater screen
     document.querySelector('#bodyColor').addEventListener("input",
     ()=>{
          document.getElementsByTagName('body')[0].style["background-color"]=document.querySelector('#bodyColor').value;
     });

     //color input updater screen
     document.querySelector('#fontColor').addEventListener("input",
     ()=>{
          let texts=document.getElementsByTagName("text");
          console.log(texts);
          for(let i=0; i<texts.length; i++){
               texts[i].style['fill']=document.querySelector('#fontColor').value;
          }
     });



}



setuppp()
