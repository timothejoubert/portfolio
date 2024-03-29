
  var Char = function (container, char, el) {
    var span = document.createElement("span");
    span.setAttribute("data-char", char);
    span.innerText = char;
    container.appendChild(span);
    this.el = el;

    this.getDist = function () {
      this.pos = span.getBoundingClientRect();
      return myDist(
        mouse.x,
        mouse.y,
        this.pos.x + this.pos.width,
        this.pos.y + this.pos.height
      );
    };
    this.getAttr = function (dist, min, max) {
      var wght = max - Math.abs((max * dist) / maxDist);
      return Math.max(min, wght + min);
    };
    this.update = function (args) {
      var dist = this.getDist();
      this.wdth = args.wdth ? ~~this.getAttr(dist, 50, 200) : 100;
      this.timScale = args.timScale ? ~~this.getAttr(dist, 0.7, 1.8) : 1;
      this.wght = args.wght ? ~~this.getAttr(dist, 100, 900) : 400;
      this.alpha = args.alpha ? this.getAttr(dist, 0.08, 0.2).toFixed(2) : 0.3;
      this.ital = args.ital ? this.getAttr(dist, 0, 1).toFixed(2) : 0;
      this.draw();
    };
    this.draw = function () {
      if (el === "bg-tim") {
        var style = "";
        style += "opacity: " + this.alpha + ";";
        // style += "justify-self: " + this.stretch() ? "stretch" : "center" + ";";
        style +=
          "font-variation-settings: 'wght' " +
          this.wght +
          ", 'wdth' " +
          this.wdth +
          ", 'ital' " +
          this.ital +
          ", 'slnt' " +
          this.ital * -10 +
          ";";
      } else {
        var style = "";
        style +=
          "font-variation-settings: 'wght' " +
          mapRange(this.wght, 100, 900, 250, 900) +
          ", 'wdth' " +
          mapRange(this.wdth, 50, 200, 90, 180) +
          ", 'ital' " +
          this.ital +
          ", 'slnt' " +
          this.ital * -10 +
          ";";
      }
      span.style = style;
    };
    return this;
  };

  var VFont = function (id) {
    this.el = id;
    this.scale = false;
    this.flex = false;
    this.alpha = true;
    this.stroke = false;
    this.width = true;
    this.weight = true;
    this.timScale = false;
    this.italic = true;
    this.stretch = false;
    var title,
      chars = [];
    let str = "Tim";

    this.init = function () {
      title = document.getElementById(this.el);
      //str = title.innerText;
      if (this.el === "bg-tim") {
        title.innerHTML = "";
        for (let i = 0; i < 64; i++) {
          let _char = new Char(title, str, this.el);
          chars.push(_char);
        }
      } else {
        str = title.innerText;
        title.innerHTML = "";
        for (let i = 0; i < str.length; i++) {
          let _char = new Char(title, str[i], this.el);
          chars.push(_char);
        }
      }
      this.set();
      window.addEventListener("resize", this.setSize.bind(this));
    };

    this.set = function () {
      title.className = "";
      title.className += this.flex ? " flex" : "";
      title.className += this.stroke ? " stroke" : "";
      this.setSize();
    };

    this.setSize = function () {
      var fontSize = window.innerWidth / str.length;
      if (this.scale) {
        var scaleY = (
          window.innerHeight / title.getBoundingClientRect().height
        ).toFixed(2);
        var lineHeight = scaleY * 0.8;
        title.style =
          "font-size: " +
          fontSize +
          "px; transform: scale(1," +
          scaleY +
          "); line-height: " +
          lineHeight +
          "em;";
      }
    };

    this.animate = function () {
      mouse.x += (cursor.x - mouse.x) / 10;
      mouse.y += (cursor.y - mouse.y) / 10;
      requestAnimationFrame(this.animate.bind(this));
      this.render();
    };

    this.render = function () {
      if (this.el === "bg-tim") {
        maxDist = title.getBoundingClientRect().width / 3.5;
      } else {
        maxDist = title.getBoundingClientRect().width / 2.5;
      }
      //maxDist = 400;
      for (let i = 0; i < chars.length; i++) {
        chars[i].update({
          wght: this.weight,
          wdth: this.width,
          ital: this.italic,
          alpha: this.alpha,
        });
      }
    };
    this.init();
    this.animate();
    return this;
  };