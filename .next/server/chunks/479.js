"use strict";
exports.id = 479;
exports.ids = [479];
exports.modules = {

/***/ 37479:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Z: () => (/* binding */ NextGame)
});

// EXTERNAL MODULE: external "next/dist/compiled/react-experimental/jsx-runtime"
var jsx_runtime_ = __webpack_require__(76931);
// EXTERNAL MODULE: ./node_modules/next/image.js
var next_image = __webpack_require__(14178);
var image_default = /*#__PURE__*/__webpack_require__.n(next_image);
// EXTERNAL MODULE: ./node_modules/next/dist/compiled/react-experimental/react.shared-subset.js
var react_shared_subset = __webpack_require__(39100);
;// CONCATENATED MODULE: ./components/IconStadium.tsx


function IconStadium() {
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        "enable-background": "new 0 0 24 24",
        height: "24px",
        viewBox: "0 0 24 24",
        width: "24px",
        fill: "#FFFFFF",
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("g", {
                children: /*#__PURE__*/ jsx_runtime_.jsx("rect", {
                    fill: "none",
                    height: "24",
                    width: "24"
                })
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("g", {
                children: /*#__PURE__*/ jsx_runtime_.jsx("path", {
                    d: "M7,5L3,7V3L7,5z M18,3v4l4-2L18,3z M11,2v4l4-2L11,2z M5,10.04C6.38,10.53,8.77,11,12,11s5.62-0.47,7-0.96 C19,9.86,16.22,9,12,9S5,9.86,5,10.04z M15,17H9l0,4.88C4.94,21.49,2,20.34,2,19v-9c0-1.66,4.48-3,10-3s10,1.34,10,3v9 c0,1.34-2.94,2.48-7,2.87L15,17z"
                })
            })
        ]
    });
}

;// CONCATENATED MODULE: ./components/IconClock.tsx


function IconClock() {
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        height: "24px",
        viewBox: "0 0 24 24",
        width: "24px",
        fill: "#FFFFFF",
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("path", {
                d: "M0 0h24v24H0z",
                fill: "none"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("path", {
                d: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("path", {
                d: "M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"
            })
        ]
    });
}

;// CONCATENATED MODULE: ./components/NextGame.tsx




const fetchFixture = async (params)=>{
    // Obtén la fecha actual
    const fechaActual = new Date();
    // Obtiene el año, mes y día
    const año = fechaActual.getFullYear();
    // El mes se indexa desde 0, así que sumamos 1 para obtener el mes actual.
    const mes = String(fechaActual.getMonth() + 1).padStart(2, "0");
    const dia = String(fechaActual.getDate()).padStart(2, "0");
    // Crea la cadena en formato "año-mes-día"
    const fechaEnFormatoAñoMesDia = `${año}-${mes}-${dia}`;
    console.log(fechaEnFormatoAñoMesDia);
    console.log("paramns ->" + params);
    const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?next=1&league=${params}&season=2023`;
    const options = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": "cfd5812b6amsh90b6b90fa19242dp1b3342jsn56fae60f75b5",
            "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com"
        }
    };
    try {
        const response = await fetch(url, options);
        const result = await response.text();
        return JSON.parse(result).response;
    } catch (error) {
        console.error(error);
    }
};
async function NextGame({ leagueId }) {
    console.log("Miramos los datos los partidos...");
    const fixtures = await fetchFixture(leagueId);
    const game = fixtures.map((item)=>item).slice(0, 3);
    const teams = game.map((item)=>item.teams);
    console.log(game.length);
    if (game.length === 0) return /*#__PURE__*/ jsx_runtime_.jsx("div", {
        className: "col-span-2 px-4",
        children: /*#__PURE__*/ jsx_runtime_.jsx("h1", {
            className: "text-2xl font-bold mb-6",
            children: "No hay partidos buenos para hoy..."
        })
    });
    return /*#__PURE__*/ jsx_runtime_.jsx(jsx_runtime_.Fragment, {
        children: game.map((fixture, index)=>/*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: `flex flex-col rounded-xl bg-gradient-to-r from-indigo-800 to-indigo-600 md:flex-row mt-4 w-full`,
                children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: "flex flex-wrap justify-between p-6 w-full",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                            className: "flex flex-col",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                    className: "flex flex-row items-center",
                                    children: [
                                        /*#__PURE__*/ jsx_runtime_.jsx("p", {
                                            className: "font-bold md:text-3xl",
                                            children: fixture.teams.home.name
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                            className: "mx-1 text-lime-400",
                                            children: "VS"
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("p", {
                                            className: "font-bold md:text-3xl",
                                            children: fixture.teams.away.name
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                    className: "flex flex-col",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                            className: "flex flex-wrap",
                                            children: [
                                                /*#__PURE__*/ jsx_runtime_.jsx(IconClock, {}),
                                                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("p", {
                                                    className: "ml-2 text-xs",
                                                    children: [
                                                        fixture.fixture.date.slice(0, 10),
                                                        ", ",
                                                        fixture.fixture.date.slice(11, 16)
                                                    ]
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                            className: "flex flex-wrap",
                                            children: [
                                                /*#__PURE__*/ jsx_runtime_.jsx(IconStadium, {}),
                                                /*#__PURE__*/ jsx_runtime_.jsx("p", {
                                                    className: "ml-2 font-bold",
                                                    children: fixture.fixture.venue.name
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                            className: "flex flex-wrap justify-end items-end",
                            children: [
                                /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                                    src: fixture.teams.home.logo,
                                    width: 100,
                                    height: 100,
                                    alt: fixture.teams.home.name,
                                    className: "mr-2"
                                }),
                                /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                                    src: fixture.teams.away.logo,
                                    width: 100,
                                    height: 100,
                                    alt: fixture.teams.away.name,
                                    className: "ml-2"
                                })
                            ]
                        })
                    ]
                })
            }, fixture.fixture.id))
    });
}


/***/ })

};
;