import { useEffect, useState } from "react";
import Main from "./main";
import RightArea from './components/Right'
import LeftArea from './components/Left'

// import "./index.css";

function OrganicMoleculeDiy() {
  const [selectedNameButton, setSelectedNameButton] = useState(null);
  const [selectedBondValueButton, setSelectedBondValueButton] = useState(null);
  const [demo, setDemo] = useState(null);

  useEffect(() => {
    const canvasDom = document.querySelector("#canvas");
    setDemo(new Main(canvasDom));

    BABYLON.Engine.NBVersion = "v1.0.0";
  }, []);

  useEffect(() => {
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvasContainer.style.width = `${w}px`;
      canvasContainer.style.height = `${h}px`;
    };

    const atomShow = (show, name) => {
      atom.style.display = show;
      atom.innerHTML = name;
    };

    const handleTouchStart = (e) => {
      e.preventDefault();
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
    };

    const handleMouseMove = (e) => {
      const atomWidth = atom.offsetWidth;
      const atomHeight = atom.offsetHeight;
      const rect = canvas.getBoundingClientRect();

      const mouseX = e.clientX - (atomWidth * 3) / 4 - rect.left;
      const mouseY = e.clientY - (atomHeight * 3) / 4 - rect.top;

      atom.style.left = mouseX + "px";
      atom.style.top = mouseY + "px";
    };

    const handleButtonMouseDown = (event) => {
      const target = event.target;

      if (target.tagName === "SPAN") {
        if (selectedNameButton) {
          selectedNameButton.style.backgroundColor = "black";
          atomShow("flex", demo.currentAtom);
        }

        if (selectedNameButton !== target) {
          target.style.backgroundColor = "blue";
          demo.currentAtom = target.innerHTML;
          setSelectedNameButton(target);
          atomShow("flex", demo.currentAtom);
        } else {
          target.style.backgroundColor = "black";
          demo.currentAtom = "";
          setSelectedNameButton(null);
          atomShow("none");
        }
      }

      if (target.tagName === "BUTTON") {
        if (selectedBondValueButton) {
          selectedBondValueButton.style.backgroundColor = "";
        }

        if (selectedBondValueButton !== target) {
          target.style.backgroundColor = "blue";
          demo.currentBondValve = Number(target.innerHTML);
          setSelectedBondValueButton(target);
        } else {
          target.style.backgroundColor = "";
          demo.currentBondValve = 0;
          setSelectedBondValueButton(null);
        }
      }

      if (demo.currentAtom && demo.atoms.length === 0) {
        demo.createFirstAtom(demo.currentAtom, demo.currentBondValve);
      }
    };

    window.addEventListener("resize", resize);
    resize();

    document.body.addEventListener("touchstart", handleTouchStart);
    document.body.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("mousemove", handleMouseMove);
    buttons.addEventListener("mousedown", handleButtonMouseDown);

    return () => {
      window.removeEventListener("resize", resize);
      document.body.removeEventListener("touchstart", handleTouchStart);
      document.body.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mousemove", handleMouseMove);
      buttons.removeEventListener("mousedown", handleButtonMouseDown);
    };
  }, [selectedNameButton, selectedBondValueButton, demo]);

  return (
    <div>
      <div id="buttons" className="buttons">
        <span>C</span>
        <span>H</span>
        <span>O</span>
        <span>Cl</span>
        <span>I</span>
        <button name="value">1</button>
        <button name="value">2</button>
        <button name="value">3</button>
      </div>
      <div className="containerWrap">
        <LeftArea></LeftArea>
        <RightArea></RightArea>
      </div>
      <div id="atom" className="atom"></div>
      <div id="canvasContainer" className="canvasContainer">
        <canvas id="canvas" className="canvas"></canvas>
      </div>
    </div>
  );
}

export default OrganicMoleculeDiy;

// ReactDOM.render(<OrganicMoleculeDiy />, document.getElementById("root"));
