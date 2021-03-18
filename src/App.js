import React, { useEffect, useState } from "react";
import axios from "axios";
import { makeUseAxios } from "axios-hooks";
import loadImage from "./loadImage.js";
import cx from "classnames";

import "./style.scss";

const NUMBER_OF_MEMES = 256;
const PROXY_URL = "https://thingproxy.freeboard.io/fetch/";
const URL = "http://alpha-meme-maker.herokuapp.com/memes/";

const useAxios = makeUseAxios({
  axios: axios.create({
    baseURL: PROXY_URL + URL,
  }),
});

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

function App() {
  const [currImg, setCurrImg] = useState([]);
  const [{ data, loading }, fetch] = useAxios({}, { manual: true });

  const handleFetchMeme = () => {
    if (!loading) {
      fetch(getRandomInt(NUMBER_OF_MEMES).toString());
    }
  };

  const getImage = async (data) => {
    try {
      await loadImage(data.data.image, false);
      setCurrImg([...currImg, data]);
    } catch (err) {
      handleFetchMeme();
    }
  };

  useEffect(() => {
    if (data) {
      getImage(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="app">
      {currImg.length > 0 && (
        <div className="app-meme-wrapper">
          <h3 className="top-text">
            {currImg[currImg.length - 1]?.data?.topText}
          </h3>
          <img src={currImg[currImg.length - 1]?.data?.image} alt="meme" />
          <h3 className="bottom-text">
            {currImg[currImg.length - 1]?.data?.bottomText}
          </h3>
        </div>
      )}
      <div className="app-button-wrapper">
        <button
          className={cx("app-button", {
            "button button--loading": loading,
          })}
          disabled={loading}
          onClick={() => {
            handleFetchMeme();
          }}
        >
          <span
            className={cx({
              "text--green": loading,
            })}
          >
            Generate Meme
          </span>
        </button>
        <button
          className="app-button "
          onClick={() => {
            setCurrImg(
              currImg.filter((_, index) => index !== currImg.length - 1)
            );
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default App;
