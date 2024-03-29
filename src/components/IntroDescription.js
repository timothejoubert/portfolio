import React, { useEffect, useState, useRef } from "react";
import { mapRange, myDist } from "../utils";

import "./IntroDescription.css";

const LetterItem = ({index, cursor, letterData}) => {
  let currentLetter = useRef(null);
  let maxDist = 70;

  const changeStyle = () => {
    letterData.opacity = getAttr(letterData.dist, 0.06, 0.1);
    letterData.width = getAttr(letterData.dist, 80, 200);
    letterData.weight = getAttr(letterData.dist, 250, 900);
    letterData.slant = mapRange(getAttr(letterData.dist, 0, 10), 0, 10, 0, -20);
  }
  const getAttr = (dist, min, max) => {
    var wght = max - Math.abs((max * dist) / maxDist);
    return Math.max(min, wght + min);
  };

  if(currentLetter.current){
    let left = currentLetter.current.getBoundingClientRect().x;
    let top = currentLetter.current.getBoundingClientRect().y;
    let w = Math.floor(currentLetter.current.getBoundingClientRect().width);
    let h = Math.floor(currentLetter.current.getBoundingClientRect().height);

    let currentDist = myDist(cursor.x ,cursor.y, left + w,top + h);
    letterData.dist = currentDist;
    if(letterData.dist !== 0){
      changeStyle();
    }
  }

  useEffect(() => {
    return () => {
    }
  }, [cursor])

  return(
    <span 
      ref={currentLetter} 
      style={{
        "--index-letter": index,
        display: letterData.value === " " && window.innerWidth > 600  ? "block" : "inline", 
        fontVariationSettings: `"wght" ${letterData.weight}, "wdth" ${letterData.width}, "slnt" ${letterData.slant}`
      }} 
    >
     {letterData.value}
    </span>
  )
}

const WordItem = ({cursor, letterData}) => {
  return(
    <>
      {letterData.length > 1 && letterData.map( (el, i) => {
          return <LetterItem cursor={cursor} index={i} key={i} letterData={el}/>
      })}
    </>
  )
}


const IntroDescription = ({ content }) => {
  const domaineContainer = useRef(null);
  const [cursor, setCursor] = useState({x: window.innerWidth, y: window.innerHeight,});
  const [windowW, setWindowW] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowW(window.innerWidth);
  }
  const handleCursor = (e) => {
    setCursor({
      x: e.clientX,
      y: e.clientY
    });
  }
  const handleTCursor = (e) => {
    var t = e.touches[0];
    setCursor({
      x: t.clientX,
      y: t.clientY
    });
  }

  let Allword = [];
  const printLetter = (txt, id) => {
    let word = [];
    for (var i = 0; i < txt.length; i++) {
      let sItem = {
        value: txt[i],
        posX: null,
        posY: null,
        height: null,
        opacity: 0.4,
        width: 80,
        weight: 250,
        slant: 0,
      }
      word.push(sItem);
    }
    Allword.push({word, id: id})
  };
  
  printLetter("Identité visuelle", "domaines-idtt");
  printLetter("Site web", "domaines-web");
  printLetter("Motion design", "domaines-motion");

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    var domaine = domaineContainer.current;
    if(domaineContainer.current){
      domaine.addEventListener("mousemove", handleCursor);
      domaine.addEventListener("touchmove", handleTCursor, {passive: false,});
    }
    return () => {
      window.removeEventListener("resize", handleResize);
      domaine.removeEventListener("mousemove", handleCursor);
      domaine.removeEventListener("touchmove", handleTCursor, {passive: false,});
    }
  }, []);


  return (
    <section className="container-about" ref={domaineContainer}>
      <article className="container-reseaux">
        <h1>{content.name}</h1>
        <div className="reseaux">
          <a
            href="https://www.instagram.com/thim_ox/"
            target="_blank"
            rel="noopener noreferrer"
            title="Ma page instagram"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_118:435)">
                <path
                  className="icon-path-reseau"
                  d="M9.80373 1.76544C12.4232 1.76544 12.7334 1.77693 13.7635 1.82288C14.7209 1.86501 15.2379 2.02585 15.5826 2.15988C16.0383 2.33605 16.3676 2.5505 16.7085 2.89133C17.0531 3.236 17.2638 3.56151 17.4399 4.01723C17.574 4.36189 17.7348 4.88272 17.7769 5.83628C17.8229 6.87027 17.8344 7.18047 17.8344 9.79607C17.8344 12.4155 17.8229 12.7257 17.7769 13.7559C17.7348 14.7133 17.574 15.2302 17.4399 15.5749C17.2638 16.0306 17.0493 16.36 16.7085 16.7008C16.3638 17.0455 16.0383 17.2561 15.5826 17.4323C15.2379 17.5663 14.7171 17.7271 13.7635 17.7693C12.7295 17.8152 12.4193 17.8267 9.80373 17.8267C7.1843 17.8267 6.8741 17.8152 5.84394 17.7693C4.88655 17.7271 4.36955 17.5663 4.02489 17.4323C3.56917 17.2561 3.23983 17.0416 2.89899 16.7008C2.55433 16.3561 2.3437 16.0306 2.16754 15.5749C2.03351 15.2302 1.87267 14.7094 1.83054 13.7559C1.78459 12.7219 1.7731 12.4117 1.7731 9.79607C1.7731 7.17664 1.78459 6.86644 1.83054 5.83628C1.87267 4.87889 2.03351 4.36189 2.16754 4.01723C2.3437 3.56151 2.55816 3.23217 2.89899 2.89133C3.24366 2.54667 3.56917 2.33605 4.02489 2.15988C4.36955 2.02585 4.89038 1.86501 5.84394 1.82288C6.8741 1.77693 7.1843 1.76544 9.80373 1.76544ZM9.80373 0C7.14217 0 6.809 0.0114887 5.76352 0.0574437C4.72188 0.103399 4.00574 0.2719 3.38535 0.513164C2.73815 0.765916 2.19052 1.09909 1.64672 1.64672C1.09909 2.19052 0.765916 2.73815 0.513164 3.38152C0.2719 4.00574 0.103399 4.71804 0.0574437 5.75969C0.0114887 6.809 0 7.14217 0 9.80373C0 12.4653 0.0114887 12.7985 0.0574437 13.8439C0.103399 14.8856 0.2719 15.6017 0.513164 16.2221C0.765916 16.8693 1.09909 17.4169 1.64672 17.9607C2.19052 18.5045 2.73815 18.8415 3.38152 19.0905C4.00574 19.3317 4.71805 19.5002 5.75969 19.5462C6.80517 19.5921 7.13834 19.6036 9.7999 19.6036C12.4615 19.6036 12.7946 19.5921 13.8401 19.5462C14.8818 19.5002 15.5979 19.3317 16.2183 19.0905C16.8617 18.8415 17.4093 18.5045 17.9531 17.9607C18.4969 17.4169 18.8339 16.8693 19.0828 16.2259C19.3241 15.6017 19.4926 14.8894 19.5385 13.8478C19.5845 12.8023 19.596 12.4691 19.596 9.80756C19.596 7.146 19.5845 6.81283 19.5385 5.76735C19.4926 4.7257 19.3241 4.00957 19.0828 3.38918C18.8415 2.73815 18.5084 2.19052 17.9607 1.64672C17.4169 1.10292 16.8693 0.765916 16.2259 0.516994C15.6017 0.27573 14.8894 0.107228 13.8478 0.0612733C12.7985 0.0114887 12.4653 0 9.80373 0Z"
                />
                <path
                  className="icon-path-reseau"
                  d="M9.80372 4.76807C7.02345 4.76807 4.76782 7.02369 4.76782 9.80397C4.76782 12.5842 7.02345 14.8399 9.80372 14.8399C12.584 14.8399 14.8396 12.5842 14.8396 9.80397C14.8396 7.02369 12.584 4.76807 9.80372 4.76807ZM9.80372 13.0706C7.99999 13.0706 6.53709 11.6077 6.53709 9.80397C6.53709 8.00023 7.99999 6.53733 9.80372 6.53733C11.6075 6.53733 13.0704 8.00023 13.0704 9.80397C13.0704 11.6077 11.6075 13.0706 9.80372 13.0706Z"
                />
                <path
                  className="icon-path-reseau"
                  d="M16.2144 4.56875C16.2144 5.21978 15.6859 5.74443 15.0387 5.74443C14.3877 5.74443 13.863 5.21595 13.863 4.56875C13.863 3.91772 14.3915 3.39307 15.0387 3.39307C15.6859 3.39307 16.2144 3.92155 16.2144 4.56875Z"
                />
              </g>
              <defs>
                <clipPath id="clip0_118:435">
                  <rect width="19.6075" height="19.6075" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/timoth%C3%A9-joubert-3b3826170/"
            target="_blank"
            rel="noopener noreferrer"
            title="Ma page linkedin"
          >
            <svg
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_118:440)">
                <path
                  className="icon-path-reseau"
                  d="M18.6729 0H1.96443C1.16405 0 0.516846 0.631881 0.516846 1.41312V18.1905C0.516846 18.9718 1.16405 19.6075 1.96443 19.6075H18.6729C19.4733 19.6075 20.1243 18.9718 20.1243 18.1943V1.41312C20.1243 0.631881 19.4733 0 18.6729 0ZM6.33398 16.7085H3.4235V7.34897H6.33398V16.7085ZM4.87874 6.07372C3.94432 6.07372 3.18989 5.31929 3.18989 4.3887C3.18989 3.45811 3.94432 2.70368 4.87874 2.70368C5.80933 2.70368 6.56376 3.45811 6.56376 4.3887C6.56376 5.31546 5.80933 6.07372 4.87874 6.07372ZM17.2253 16.7085H14.3187V12.1589C14.3187 11.0752 14.2995 9.67735 12.806 9.67735C11.2933 9.67735 11.0635 10.8607 11.0635 12.0823V16.7085H8.16069V7.34897H10.9486V8.62805H10.9869C11.3737 7.89277 12.3234 7.11536 13.7366 7.11536C16.6815 7.11536 17.2253 9.05313 17.2253 11.573V16.7085Z"
                />
              </g>
              <defs>
                <clipPath id="clip0_118:440">
                  <rect
                    width="19.6075"
                    height="19.6075"
                    fill="white"
                    transform="translate(0.516846)"
                  />
                </clipPath>
              </defs>
            </svg>
          </a>
          <a
            href="https://github.com/timothejoubert"
            target="_blank"
            rel="noopener noreferrer"
            title="Ma page github"
          >
            <svg
              width="20"
              height="19"
              viewBox="0 0 20 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="icon-path-reseau"
                d="M9.55188 0C4.29308 0 0.0336914 4.25939 0.0336914 9.51818C0.0336914 13.73 2.75827 17.2874 6.54175 18.5486C7.01766 18.6318 7.19612 18.3463 7.19612 18.0964C7.19612 17.8704 7.18423 17.1208 7.18423 16.3237C4.79278 16.7639 4.1741 15.7407 3.98374 15.2053C3.87666 14.9317 3.41265 14.0869 3.00812 13.8609C2.67499 13.6824 2.19908 13.2422 2.99623 13.2303C3.74578 13.2184 4.28118 13.9203 4.45965 14.2059C5.31628 15.6455 6.68452 15.241 7.23182 14.9911C7.3151 14.3725 7.56495 13.956 7.8386 13.7181C5.72081 13.4801 3.50783 12.6592 3.50783 9.01848C3.50783 7.98338 3.87666 7.12674 4.48344 6.46047C4.38826 6.22251 4.05512 5.2469 4.57862 3.93815C4.57862 3.93815 5.37577 3.6883 7.19612 4.91376C7.95758 4.6996 8.76663 4.59252 9.57567 4.59252C10.3847 4.59252 11.1938 4.6996 11.9552 4.91376C13.7756 3.6764 14.5727 3.93815 14.5727 3.93815C15.0962 5.2469 14.7631 6.22251 14.6679 6.46047C15.2747 7.12674 15.6435 7.97148 15.6435 9.01848C15.6435 12.6711 13.4186 13.4801 11.3008 13.7181C11.6459 14.0155 11.9433 14.5866 11.9433 15.4789C11.9433 16.752 11.9314 17.7752 11.9314 18.0964C11.9314 18.3463 12.1099 18.6437 12.5858 18.5486C14.4754 17.9108 16.1174 16.6965 17.2807 15.0765C18.4439 13.4565 19.0697 11.5125 19.0701 9.51818C19.0701 4.25939 14.8107 0 9.55188 0Z"
              />
            </svg>
          </a>
        </div>
      </article>
      <article className="about-description">
        {windowW < 677 ? (
            <h2>
              Je suis <strong>designer graphique</strong> &amp;{" "}
              <strong>développeur freelance</strong>, Je crée des systèmes
              graphiques innovants en alliant
            </h2>
          ) : (
            <h2>
              Je suis <strong>designer graphique</strong> &amp;{" "}
              <strong>développeur freelance</strong>, <br />
              Je crée des systèmes graphiques innovants en alliant
            </h2>
          )}
        <div className={windowW > 600 ? "about-support" : "about-support anim-letter"}>
          {Allword.length > 1 && Allword.map( (el, i) => {
            return(
              <h2 key={i} id={el.id}>
                <WordItem cursor={cursor} letterData={el.word}/>
              </h2>
            )
          })}
          {/* <h2 id="domaines-idtt">
            Identité <br /> de marque
          </h2>
          <h2 id="domaines-web">
            Site
            <br /> web
          </h2>
          <h2 id="domaines-motion">
            Motion
            <br /> design
          </h2> */}
          <div className="svg-help">
            <p>{windowW < 800 ? "Tap": "Hover"}</p>
            <svg
              width="140"
              height="125"
              viewBox="0 0 140 125"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M66.2159 56.7354C18 35 61.0999 -20.0686 114.5 10.4995C167.9 41.0676 136 118.5 1.00006 118.5"
                className="line-help"
              />
              <path d="M8 112L1 118.5L8 124.5" className="arrow-help" />
            </svg>
          </div>
        </div>
      </article>
    </section>
  );
};

export default IntroDescription;
