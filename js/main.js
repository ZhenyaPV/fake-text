(async () => {
    try {
        [].flat()
    } catch (t) {
        Object.defineProperty(Array.prototype, "flat", {
            value: function (t = 1) {
                return this.reduce(function (e, i) {
                    return e.concat(Array.isArray(i) && t > 1 ? i.flat(t - 1) : i)
                }, [])
            }
        })
    }

    class t {
        constructor(t) {
            this.pathArr = t
        }

        reverse() {
            let t = [];
            for (let e = 0; e < this.pathArr.length; e++) {
                let i = this.pathArr[e].replace(/[^0-9] /g, "").slice(0, -2).split(" "), s = [], n = [];
                for (let t = 0; t < i.length; t += 2) s.push(i[t]);
                for (let t = 1; t < i.length; t += 2) n.push(i[t]);
                n.reverse();
                let r = "M ";
                for (let t = 0; t < s.length; t++) r += s[t] + " " + n[t] + " ";
                r += "z", t.push(r)
            }
            return t
        }
    }

    class e {
        constructor(t, e, i, s, n) {
            this.textArr = e, this.buffer = "", this.fontColor = s, this.marginLeft = 0, this.linePathCounter = 0, this.fontSize = i, this.linePath = t, this.group = [], this.unwrittenText = [], this.font = n, this.write()
        }

        getPathWidth(t) {
            return new fabric.Path(t).width
        }

        modePath(t) {
            return new fabric.Path(t)
        }

        write() {
            let t, e = !1;
            for (let i = 0; i < this.textArr.length; i++) if (t = i, this.widthOfWord(this.textArr[i] + " ") + this.marginLeft < new fabric.Path(this.linePath[this.linePathCounter]).width) {
                if (this.buffer += this.textArr[i] + " ", this.marginLeft += this.widthOfWord(this.textArr[i] + " "), this.textArr[i].includes("\n")) {
                    let t = this.modePath(this.linePath[this.linePathCounter]);
                    this.writeLine(t), this.buffer = "", this.marginLeft = 0, this.linePathCounter++
                }
            } else if (this.splitWordsIntoSyllables(this.textArr[i]).length > 1) {
                let t = this.splitWordsIntoSyllables(this.textArr[i]), e = "", s = t.length - 1;
                for (; 0 !== s;) {
                    for (let i = 0; i < s; i++) e += t[i];
                    if (new fabric.Text(e + " -" + this.buffer + " ", {
                        fontSize: this.fontSize,
                        fontFamily: this.font
                    }).width < this.getPathWidth(this.linePath[this.linePathCounter])) {
                        if (this.buffer += e + " -", this.writeLine(this.modePath(this.linePath[this.linePathCounter])), this.marginLeft = 0, this.linePathCounter++, this.buffer = t.splice(s, t.length).join("") + " ", this.marginLeft += this.widthOfWord(this.buffer + " "), this.linePathCounter === this.linePath.length) return void (this.unwrittenText = [this.buffer].concat(this.textArr.slice(i + 1)));
                        break
                    }
                    if (1 === s && this.linePathCounter < this.linePath.length) {
                        this.writeLine(this.modePath(this.linePath[this.linePathCounter])), this.marginLeft = 0, this.textArr[i].includes("\n") || this.linePathCounter++, this.buffer = this.textArr[i] + " ", this.marginLeft += this.widthOfWord(this.buffer + " ");
                        break
                    }
                    if (1 === s) return void (this.unwrittenText = [this.buffer].concat(this.textArr.slice(i)));
                    s--, e = ""
                }
            } else {
                if (!(this.linePathCounter < this.linePath.length)) {
                    e = !0, this.unwrittenText = this.unwrittenText.concat(this.textArr.slice(i - 1));
                    break
                }
                this.writeLine(this.modePath(this.linePath[this.linePathCounter])), this.buffer = "", this.marginLeft = 0, this.linePathCounter++, this.buffer += this.textArr[i] + " ", this.marginLeft += this.widthOfWord(this.textArr[i] + " ")
            }
            0 === this.buffer.length || e || (this.linePathCounter !== this.linePath.length ? this.writeLine(this.modePath(this.linePath[this.linePathCounter])) : this.unwrittenText = this.textArr.slice(t), this.buffer = "")
        }

        isVowels(t) {
            return "уеёыаоэяию".includes(t)
        }

        splitWordsIntoSyllablesRus(t) {
            let e = [], i = 0;
            for (let n = 0; n < t.length; n++) {
                function s(e, s) {
                    t[n] === e && t[n + 1] === s && n < t.length - 2 && i++
                }

                void 0 === e[i] ? e[i] = t[n] : e[i] += t[n], n < 1 || (this.isVowels(t[n]) && !this.isVowels(t[n + 1]) && this.isVowels(t[n + 2]) && i++, t[n] === t[n + 1] && n < t.length - 2 && i++, s("б", "л"), s("р", "м"), s("ь", "ш"), s("д", "н"), s("с", "л"), s("в", "с"), s("ь", "м"), s("ь", "н"), s("ь", "з"), s("ь", "ж"), s("з", "н"), s("в", "ч"), s("р", "с"), s("к", "т"), s("с", "к"), s("е", "с"), s("й", "к"), s("л", "н"), s("ч", "к"), s("ь", "с"), s("г", "с"), s("к", "ж"), s("ж", "н"), s("в", "ш"), s("в", "н"), s("т", "в"), s("х", "н"), s("т", "н"), s("з", "в"), s("ч", "н"))
            }
            return e.join("­")
        }

        splitWordsIntoSyllables(t) {
            $("body").append("<p id='split' style='display: none'>" + t + "</p>");
            let e = $("p#split");
            return e.hyphenate("en-us"), e.remove(), this.getSyllables(this.splitWordsIntoSyllablesRus(e.text()).split(/\u00AD/g))
        }

        getSyllables(t) {
            let e = t;
            if (1 === t[0].length) {
                e = [];
                for (let i = 0; i < t.length - 1; i++) 0 === i ? e.push(t[i] + t[i + 1]) : e.push(t[i + 1])
            }
            return e
        }

        widthOfWord(t) {
            return new fabric.Text(t, {fontSize: this.fontSize, fontFamily: this.font}).width
        }

        writeLine(t) {
            let e = new fabric.Text(this.buffer, {
                fontSize: this.fontSize,
                path: t,
                top: t.top,
                left: t.left,
                fontFamily: this.font,
                shadow: "rgba(0,0,0,0.4) 0 0 5px",
                fill: this.fontColor
            });
            this.group.push(e)
        }

        getWrittenText() {
            return this.group
        }

        getUnwrittenText() {
            return "\n" === this.unwrittenText[0] && "\n" === this.unwrittenText[2] ? this.unwrittenText.slice(3) : "\n" === this.unwrittenText[0] ? this.unwrittenText.slice(1) : this.unwrittenText
        }
    }

    $("#font-size, #seep, #rand-space").on("change", () => {
        v()
    });
    let i, s, n, r, l, o, a, h, c, f = $("textarea"), d = !0, p = !1, u = "1", g = !1, m = 0, w = 0, b = !0,
        x = $(".slick-content");

    async function k() {
        return new Promise(t => {
            $.ajax({
               url:"presets/"+u+".json", dataType: "json", async: !0, success: function (e) {
                    i = e.width, s = e.height, n = e.image, r = e.path, l = e.color, o = e.isSeep, a = e.font, h = e.seepColor, c = e.fontSize, t()
                }
            })
        })
    }

    function v() {
        d && ($(".slick-slider img").css("filter", "blur(3px)"), $(".slick-arrow").css("display", "none"), x.append("<p>НАЖМИТЕ ЧТОБЫ ОБНОВИТЬ</p>").removeClass("error-content").removeClass("error-connect"), d = !1)
    }

    function y() {
        $("#seep").prop("checked", o), $("#font-size").val(2)
    }

    await k(), y(), $(".color-popup__body .radio-label").click(function () {
        let t = $(".color-choose p"), e = $(".color"), i = m;
        switch ($(this).attr("for")) {
            case"black":
                t.text("Чёрный"), e.css("background", "black"), m = 0;
                break;
            case"blue":
                t.text("Синий"), e.css("background", "blue"), m = 1;
                break;
            case"red":
                t.text("Красный"), e.css("background", "red"), m = 2
        }
        i !== m && v()
    }), f.on("input selectionchange propertychange", function () {
        v()
    }), x.mousedown(function () {
        if (!d && b) {
            b = !1, $("html").addClass("loading-start"), $("nav ul").css("opacity", "0.5"), f.blur(), GLOBAL = 0, p = !0;
            let o = 750, g = !1;
            $("html, body").animate({scrollTop: x.offset().top}, o), function () {
                let t = $(".slick-content ").height();
                $(".slick-slider.slick-content").slick("unslick"), x.empty().css("height", t + "px"), $("canvas").remove()
            }(), $(".slider__preview").empty(), x.attr("data-content", "Загрузка..."), setTimeout(() => {
                new FontFaceObserver(a[w]).load().then(async function () {
                    IMAGE = [];
                    try {
                        let o = f[0].value.trimEnd();
                        try {
                            o = o.replaceAll("Ё","Е")
                        }
                        catch(e){
                            alert("Возможны ошибки с буквой \"Ё\". Пожалуйста, обновите браузер.");
                        }
                        const d = "\n0123456789,!?.\"'()+=:*%$;@#/{}<>&][ -—–qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNMйцукенгшщзхъфывапролджэячсмитьбюЙЦУКЕНГШЩЗХФЫВАПРОЛДЖЭЯЧСМИТЬБЮїЇіІєЄёЁ\\";
                        if (function t() {
                            if (o.includes(" \n")) o = o.replace(" \n", "\n"), t(); else {
                                let t = "";
                                for (let e = 0; e < o.length; e++) d.includes(o[e]) && (t += o[e]);
                                o = t
                            }
                        }(), $("#rand-space").prop("checked")) try {
                            o = o.replaceAll("н ", "н  ").replaceAll("о ", "о  ").replaceAll("е ", "е  ").replaceAll("м ", "м  ").replaceAll("у ", "у  ")
                        } catch (t) {
                            alert("У вас старый браузер. Отступы между словами будут одинаковы. Пожалуйста, обновите браузер.")
                        }
                        await new class {
                            constructor(i, s, n, r, l, o, a, h, c, f) {
                                return this.images = [], new Promise(async function (d, p) {
                                    let g = h, m = 0, w = 0, b = [], x = h;
                                    for (; x.length > 0;) {
                                        if (m === r.length) return void p("TOO MANY TEXT");
                                        let t = new e(n[m], x, l, a, o, f), i = [];
                                        for (let e = 0; e < t.getWrittenText().length; e++) i.push(t.getWrittenText()[e].text);
                                        m++, w++, x = t.getUnwrittenText(), b.push(i)
                                    }
                                    for (m = 0; g.length > 0;) {
                                        if ($(".slick-content").attr("data-content", m + " / " + w), m === r.length) return void p("TOO MANY TEXT");
                                        let h = new e(n[m], g, l, a, o, f);
                                        k("canvas" + m, i, s);
                                        let d = new fabric.StaticCanvas("canvas" + m);
                                        await new Promise(function (i, s) {
                                            let p = new Image;
                                            p.src = "presets/Preset" + u + "/" + r[m], p.onload = (() => {
                                                d.setBackgroundImage("presets/Preset" + u + "/" + r[m], function () {
                                                    d.renderAll.bind(d);
                                                    for (let t = 0; t < h.getWrittenText().length; t++) {
                                                        d.add(h.getWrittenText()[t]), h.getWrittenText()[t].text[0].includes("\n") && (h.getWrittenText()[t].text = h.getWrittenText()[t].text.replace("\n ", ""));
                                                        let e = h.getWrittenText()[t].toDataURL();
                                                        fabric.Image.fromURL(e, function (t) {
                                                            t.filters.push(new fabric.Image.filters.Sepia), t.applyFilters(), d.add(t)
                                                        })
                                                    }
                                                    if (c) {
                                                        let i = new e([], []), s = 0;
                                                        if (m % 2 == 0) {
                                                            if (void 0 !== b[m + 1]) for (let r = 0; r < b[m + 1].length; r++) i = new e(new t([n[m][s]]).reverse(), [b[m + 1][s]].join("").split(" ").map(t => t.split(/(\n)/)).flat(), l, a, o), s++, d.add(i.getWrittenText()[0].set("flipX", !0).set("fill", f))
                                                        } else if (void 0 !== b[m - 1]) for (let r = 0; r < b[m - 1].length; r++) i = new e(new t([n[m][s]]).reverse(), [b[m - 1][s]].join("").split(" ").map(t => t.split(/(\n)/)).flat(), l, a, o), s++, d.add(i.getWrittenText()[0].set("flipX", !0).set("fill", f))
                                                    }
                                                    let s = d.toDataURL("image/jpeg");
                                                    GLOBAL++, IMAGE.push(s), i()
                                                })
                                            }), p.onerror = (() => {
                                                s("ERROR CONNECT")
                                            })
                                        }).catch(p), m++, g = h.getUnwrittenText()
                                    }

                                    function k(t, e, i) {
                                        $("body").append("<canvas style='display:none;' id=\"" + t + '" width="' + e + '" height="' + i + '"></canvas>')
                                    }

                                    d()
                                })
                            }
                        }(i, s, r, n, function () {
                            let t = $("#font-size").val(), e = c[w];
                            "1" === t ? e -= 10 : "3" === t ? e += 10 : "4" === t && (e += 20);
                            return e
                        }(), a[w], l[m], o.split(" ").map(t => t.split(/(\n)/)).flat(), $("#seep").prop("checked"), h[m])
                    } catch (t) {
                        g = !0, "TOO MANY TEXT" === t ? ($(".slick-content img").addClass("hidden"), x.addClass("error-content"), $(".menu-block").addClass("hidden"), $("html").removeClass("loading-start")) : "ERROR CONNECT" === t ? ($(".slick-content img").addClass("hidden"), x.addClass("error-connect"), $(".menu-block").addClass("hidden"), $("html").removeClass("loading-start")) : (alert("Ошибка: " + t + " пожалуйста, обновите браузер"), $("html").removeClass("loading-start"))
                    }
                    g || (!function () {
                        for (let t = 0; t < IMAGE.length; t++) x.append('<img src="' + IMAGE[t] + '" height="' + s + '" width="' + i + "\" alt='Рукописный текст' \">");
                        x.slick({
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            speed: 0,
                            waitForAnimate: !1,
                            infinite: !1,
                            swipe: !1,
                            dots: !0
                        })
                    }(), $("html").removeClass("loading-start")), $("html, body").animate({scrollTop: x.offset().top}, 0), x.attr("data-content", ""), b = !0, $(".input-block__settings").css("pointer-events", "auto"), $("nav ul").css("opacity", "1"), g || x.css("height", "auto")
                }, async function () {
                    alert("Font is not available")
                }), $("img").css("filter", "blur(0px)"), d = !0
            }, o)
        }
    }), f.click(() => {
        g || f[0].setSelectionRange(0, f[0].value.length), g = !0
    }), $(".presets-grid").on("click", "div", async function () {
        $(".preset-preview").removeClass("preset-preview_selected"), $(this).addClass("preset-preview_selected"), u !== $(this).index() + 1 && (v(), u = $(this).index() + 1, await k(), y())
    }), $("#download-zip").click(function () {
        let t = new JSZip, e = new Image, i = $(".slick-content img");

        function s() {
            $("html").removeClass("loading-start")
        }

        $(this).prop("disabled", !0), $(this).html("Загрузка...<br>Это может занять время"), $("#download-zip").css("cursor", "progress"), $("html").addClass("loading-start"), p ? setTimeout(() => {
            for (let s = 0; s < i.length; s++) e.src = i[s].src, t.file(s + 1 + ".jpg", e.src.substr(e.src.indexOf(",") + 1), {base64: !0});
            t.generateAsync({type: "blob"}).then(function (t) {
                saveAs(t, "Фото.zip"), $("#download-zip").prop("disabled", !1).css("cursor", "pointer").html("Архивом (.zip)"), s()
            })
        }, 50) : setTimeout(() => {
            let t = document.createElement("a");
            t.setAttribute("href", "demo/Демо.zip"), t.setAttribute("download", "Демо"), t.click(), $("#download-zip").prop("disabled", !1).css("cursor", "pointer").html("Архивом (.zip)"), s()
        }, 1500)
    }), $("#download-each").click(function () {
        if (p) {
            let t = $(".slick-content img");
            for (let e = 0; e < t.length; e++) {
                let i = new Image;
                i.src = t[e].src, download(i.src, e + 1 + ".jpg")
            }
        } else {
            let t = $(".slick-content img");
            for (let e = 0; e < t.length; e++) {
                let i = new Image;
                i.src = t[e].src, download(i.src, e + 1 + "-демо.jpg")
            }
        }
    }), $(".font-popup__body .radio-label").click(function () {
        $(".font-choose p").attr("class", $(this).attr("for"));
        let t = w;
        switch ($(this).attr("for")) {
            case"Tibalt":
                w = 0;
                break;
            case"Pag":
                w = 1;
                break;
            case"Abram":
                w = 2;
                break;
            case"Benvolio":
                w = 3;
                break;
            case"Capuletty":
                w = 4;
                break;
            case"Eskal":
                w = 5;
                break;
            case"Lorenco":
                w = 6;
                break;
            case"Montekky":
                w = 7
        }
        t !== w && ($("#font-size").val(2), v())
    }), $(document).ready(() => {
        function t(t) {
            $("html").addClass("pointer-events-none"), setTimeout(() => {
                $("html").removeClass("pointer-events-none")
            }, t)
        }

        $("#settings, #presets, #download").click(function () {
            $("#" + $(this).attr("id") + "-popup").addClass("open"), t(20)
        }), $(".popup__close").click(function () {
            $(".popup").removeClass("open"), t(300)
        }), $(".popup").on("mousedown", function (t) {
            t.target.closest(".popup__content") || $(this).removeClass("open")
        }), $(document).on("keydown", function (t) {
            "Escape" === t.code && $(".popup").removeClass("open")
        })
    })
})();

$(document).ready(() => {

    let jTextarea = $("textarea");
    let isOpen = false;

    $('.textarea__resizer').on('click', () => {

        if (!isOpen) {
            jTextarea.css("height", jTextarea.innerHeight(400) + "px");
            isOpen = !isOpen;
            $('.marker-resizer').text("Свернуть");
        } else {
            jTextarea.css("height", jTextarea.innerHeight(100) + "px");
            isOpen = !isOpen;
            $('.marker-resizer').text("Развернуть");
        }

    });

    $(".color-choose").click(() => {
        $(".color-popup.list-popup").css("opacity", "1").css("visibility", "visible");
    });

    $(".list-popup label, .list-popup").click(() => {
        $(".list-popup").css("opacity", "0").css("visibility", "hidden");
    });

    $(".font-choose").click(() => {
        $(".font-popup.list-popup").css("opacity", "1").css("visibility", "visible");
    });

    $(".own-font").click(() => {
        $(".own-font-popup").css("opacity", "1").css("visibility", "visible");
    });

    $(".own-font-popup .popup__body").click(() => {
        $(".own-font-popup").css("opacity", "0").css("visibility", "hidden");
    });

});