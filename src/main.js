import './style.css'
import * as htmlToImage from 'html-to-image';
import { toPng, toCanvas} from 'html-to-image';
//use an event listener to get data from input, and update image src property

//`data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><text x='0' y='50' font-family='invinc'>${element.value}</text></svg>`

document.querySelector('#app').innerHTML = `
     <div style="width:fit-content;">
          <input id="inne" type="text" placeholder="Edit text here" autocomplete="off">
          <button id="download">Render it!</button>
     </div>
     <div style="width:fit-content;">
          <label for="bodyColor">Body Color</label>
          <input id="bodyColor" type="color" value="#b51616"/>
          <label for="fontColor">Font Color</label>
          <input id="fontColor" type="color" value="#fcfcf1">
     </div>
     <canvas id="canva" width="880" height="1036"></canvas>
     <div id="playingField" class="standard">
          <div id="ttt2">
               <div id="ttt">
                    <svg id="NNNN" xmlns='http://www.w3.org/2000/svg' viewBox="0 0 1036 1036" preserveAspectRatio="xMidYMidmeet">
                    <filter id="bend">
                         <!--<path id="patth" stroke="red" fill="red" d="M 0 50 A 1 6 90 1 1 550 50 L 550 0 A 1 6 90 1 0 0 0 z"></path>-->
                         <feImage result="goods"  height="100%" preserveAspectRatio="none" id="imageFilter"/>
                         <feDisplacementMap in="SourceGraphic" in2="goods" xChannelSelector="B" yChannelSelector="R" scale="50" y="0"  height="100%" preserveAspectRatio="none"/>
                    </filter>
                    <!--<rect x='0' y='0' width="700px" height="700px" filter="url(#bend)"/>-->
                         <image x='67px' y='0' id="prerender"></image>
                         <text id="editText" x='67px' y='570px' font-family='invinc' textLength="880px" text-anchor="start" lengthAdjust="spacingAndGlyphs" filter="url(#bend)">
                         </text>
                         <text x='410px' y='630px' font-size="20px" font-family="fantasy" style="fill: rgb(252, 252, 241);">
                              BASED ON THE COMIC BOOK BY
                         </text>
                         <text x='365px' y='660px' font-size="20px" font-family="fantasy" style="fill: rgb(252, 252, 241);" class="subtext">
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

function setuppp(){
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

     let element=document.querySelector('#inne');
     element.addEventListener("keyup",
     (e)=>{
          //let contexty=document.getElementById("canva").getContext('2d');
          //contexty.font = "50px serif";
          //contexty.fillText(document.querySelector('#inne').value,10,30);
          let text=document.getElementById("editText");
          text.innerHTML=document.querySelector('#inne').value;
          //console.log(text.innerHTML)
          text.style["font-size"]=(document.querySelector('#inne').value.length>6 ? `${(660/document.querySelector('#inne').value.length)*(500/110)}px` : "500px")
          //`calc(calc(min(100vw,1000px) - 477px) / ${document.querySelector('#inne').value.length})`;//`${1000/document.querySelector('#inne').value.length+10}px`;

     });

     element=document.querySelector('#download');
     element.addEventListener("click",
     ()=>{

          document.querySelector('#playingField').className="rendering";//<image x='60px' y='0' id="prerender"></image>
          tempNode=document.querySelector('#editText').cloneNode(true);

          //(async ()=>{
               let newElement = document.createElement('image');
               newElement.setAttribute('id',"dummy");
               document.querySelector('#editText').replaceWith(newElement);


               let contexty=document.getElementById("canva").getContext('2d');
               contexty.textAlign="center";
               contexty.fillStyle=document.querySelector("#fontColor").value;
               contexty.filter="url(#bend)";
               contexty.font =`${document.querySelector('#inne').value.length>6 ? `${(660/document.querySelector('#inne').value.length)*(500/110)}px` : "500px"} invinc`;
               contexty.fillText(document.querySelector('#inne').value,440,550);
               document.getElementById("canva").toBlob((blob)=>{
                    document.querySelector('#prerender').setAttribute('href',URL.createObjectURL(blob));
               },'image/png')
               contexty.reset();


          /*})().then(()=>{
               console.log("hi!");
               let a=;
               return a;
          })*/
     });


     document.querySelector('#close').addEventListener("click",
     ()=>{
          let elementP=document.querySelector('#displayScreen');
          elementP.className="close";
     });

     document.querySelector('#bodyColor').addEventListener("input",
     ()=>{
          //console.log(document.getElementsByType('body'));
          document.getElementsByTagName('body')[0].style["background-color"]=document.querySelector('#bodyColor').value;
     });

     document.querySelector('#fontColor').addEventListener("input",
     ()=>{
          let texts=document.getElementsByTagName("text");
          console.log(texts);
          for(let i=0; i<texts.length; i++){
               texts[i].style['fill']=document.querySelector('#fontColor').value;
          }
     });

     document.querySelector("#prerender").addEventListener("load",
     ()=>{
          console.log("loaded");
          console.log('hi');
          htmlToImage.toPng(document.querySelector('#playingField'))
          .then((dataUrl) => {
               document.querySelector('#rendered').src = dataUrl;
               document.querySelector('#displayScreen').className="open";
               document.querySelector('#playingField').className="standard";
               document.querySelector('#prerender').setAttribute('href','');
               document.querySelector('#dummy').replaceWith(tempNode);
          })
          .catch((err) => {
               console.error('oops, something went wrong!', err);
          });
     });

}



setuppp()
