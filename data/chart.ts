let options = {
series: [{
    data: [5, 12, 15, 18, 16, 20, 16, 13, 10, 6]
}],
chart: {
    height: 350,
    type: 'bar',
    toolbar: {
        show: false,
    },    
    events: {
        click: function(chart, w, e) {
        }
}
},
colors: ['#f34451'],
plotOptions: {
    bar: {
        columnWidth: '40%',
        distributed: true,
        startingShape: 'rounded',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
        borderRadius: 12,
    }
},
dataLabels: {
    enabled: false
},
legend: {
    show: false
},
xaxis: {
    categories: [ 'Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct'],
    labels: {
        style: {
            fontSize: '12px',
            fontFamily: 'Roboto, sans-serif',
        }
    },
    axisBorder: {
        show: false,
    },
    axisTicks: {
        show: false,
    }
},
responsive: [{
  breakpoint: 576,
  options: {
    chart: {
      height: 200,
    }
  },
}],
};
let options2 = {
   
    chart: {
    height: 365,
    type: 'rangeBar',
    toolbar: {
        show: false,
    }
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '20%',
      rangeBarGroupRows: true,
    }
  },
  colors: [ "#f34451", "#89c826" ],
  xaxis: {
    type: 'data',
    axisBorder: {
        show: false,
    },
    axisTicks: {
        show: false,
    }
  }
  };
 let series =  [
    {
      data: [
        {
          x: 'Mon',
          y: [
           0,
            10
          ]
        },
        {
          x: 'Tue',
          y: [
            18,
            10
          ]
        },
        {
          x: 'Wed',
          y: [
            20,
            15
          ]
        },
        {
          x: 'Thu',
          y: [
            20,
            30
          ]
        }
      ]
    },
    {
        data: [
          {
            x: 'Mon',
            y: [
             12,
              20
            ]
          },
          {
            x: 'Tue',
            y: [
              25,
              20
            ]
          },
          {
            x: 'Wed',
            y: [
              10,
              14
            ]
          },
          {
            x: 'Thu',
            y: [
              5,
              10
            ]
          }
        ]
      }
  ];
  let options3 = {
    chart: {
      height: 420,
      offsetY: 0,
    sparkline: {
      enabled: true
    },
    type: 'radialBar',
  },
  plotOptions: {
    radialBar: {
      startAngle: -100,
      endAngle: 100,
      hollow: {
        margin: 5,
        size: '60%',
        background: 'transparent',
        image: undefined,
      },
      dataLabels: {
        name: {
          show: false,
        },
        value: {
          fontSize: "30px",
          show: false
        },
        total: {
          show: true,
          label: 'Total',
          formatter: function (w) {
              return 75
          }
         }
      }
    }
  },
  grid: {
    padding: {
      top: -10,
      bottom: 20
    }
  },
  colors: ['#f34451', '#89c826', '#ffcc33'],
  labels: ['Vimeo', 'Messenger', 'LinkedIn'],
  responsive: [{
    breakpoint: 440,
    options: {
      chart: {
        height: 300,
      }
    }
  },{
    breakpoint: 340,
    options: {
      chart: {
        height: 250,
      }
    }
  }
  ]
  };
  let earningsoption ={
    chart: {
      height: 140,
      type: 'bar',
      width: 100,
      sparkline: {
        enabled: true
      }
    },
    fill: {
      colors: ['#ff5c41'],
      opacity:1
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
        columnWidth: '30%',
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      }
    },
    colors:['#ff5c41'],
    stackBars: true,
    dataLabels: {
      enabled: false,
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ["#ff5c41"]
      }
    },
    
    xaxis: {
      position: 'top',
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      crosshairs: {
        fill: {
          type: 'gradient',
          gradient: {
            colorFrom: '#D8E3F0',
            colorTo: '#BED1E6',
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          }
        }
      },
      tooltip: {
        enabled: false,
      }
    },
    yaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
      }            
    },
    title: {
      text: 'Monthly Inflation in Argentina, 2002',
      floating: false,
      offsetY: 330,
      align: 'center',
      style: {
        color: '#444'
      }
    }
  }
let useroptions = {
  chart: {
      type: 'donut',
      width: 320,
  },
  dataLabels: {
      enabled: false
  },
  labels: ['Total user', 'Recently user', 'Sellers', 'Buyers'],
  colors: ["rgba(100, 117, 137, 0.1)", "#f35d43", "#89c826", "#f35d43"],
  plotOptions: {
  pie: {
    expandOnClick: false
  }
},
responsive: [{
  breakpoint: 1730,
  options: {
    chart: {
      width: 230
    },
    legend: {
      position: 'bottom'
    }
  }
},
{
  breakpoint: 1200,
  options: {
    chart: {
      width: 300
    },
    legend: {
      position: 'bottom'
    }
  }
},
{
  breakpoint: 768,
  options: {
    chart: {
      width: 380
    },
    legend: {
      position: 'right',
      horizontalAlign: 'right', 
    }
  }
},
{
  breakpoint: 480,
  options: {
    chart: {
      width: 340
    },
    legend: {
      position: 'bottom'
    }
  }
},
{
  breakpoint: 406,
  options: {
    chart: {
      width: 250
    },
    legend: {
      horizontalAlign: 'center', 
    }
  }
}]
}
const revenue = {
  chart: {
      width: 600,
      type: 'donut',
      dropShadow: {
        enabled: true,
        color: '#111',
        top: -1,
        left: 3,
        blur: 3,
        opacity: 0.2
      }
  },
  dataLabels: {
      enabled: false,
      dropShadow: {
          blur: 3,
          opacity: 0.5
      },
  },
  series: [50, 30, 41],
  labels: ["Channai", "Ahemdabad", "Banglore"],
  legend: {
      formatter: function(val, opts) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex] + "%"
      }
  },
  colors: ["rgba(243, 93, 67, 0.3)", "rgba(243, 93, 67, 0.5)", "#f35d43"],
  responsive: [{
      breakpoint: 1900,
      options: {
          chart: {
              width: 420
          },
      }
  },
  {
      breakpoint: 1776,
      options: {
          chart: {
              width: 380
          },
      }
  },
  {
      breakpoint: 1661,
      options: {
          chart: {
              width: 360
          },
          legend: {
              position: 'bottom'
          }
      }
  },
  {
      breakpoint: 480,
      options: {
          chart: {
              width: 250
          },
          legend: {
              position: 'bottom'
          }
      }
  }]

}

let incomechart = {
  series: [{
          name: "Rent income",
          data: [20, 25, 20, 30, 20, 50, 30, 35, 25, 60, 0]
      },
      {
          name: "Sale income",
          data: [10, 20, 10, 15, 10, 20, 15, 10, 15, 20, 0]
      }
  ],
  chart: {
      height: 320,
      type: 'area',
      dropShadow: {
          enabled: true,
          top: 10,
          left: 0,
          blur: 3,
          color: '#720f1e',
          opacity: 0.15
      },
      toolbar: {
          show: false
      },
      zoom: {
          enabled: false
      },
  },
  markers: {
      strokeWidth: 4,
      strokeColors: "#ffffff",
      hover: {
          size: 9,
      }
  },
  dataLabels: {
      enabled: false
  },
  stroke: {
      curve: 'smooth',
      lineCap: 'butt',
      width: 4,
  },
  legend: {
      show: false
  },
  colors: ["#ff5c41", "#89c826"],
  fill: {
      type: 'gradient',
      gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.5,
          opacityTo: 0.4,
          stops: [0, 90, 100]
      }
  },
  grid: {
      xaxis: {
          lines: {
              borderColor: 'transparent',
              show: false,
          }
      },
      yaxis: {
          lines: {
              borderColor: 'transparent',
              show: false,
          }

      },
      padding: {
          right: -112,
          bottom: 0,
          left: 15
      }
  },
  responsive: [{
      breakpoint: 1200,
      options: {
          grid: {
              padding: {
                  right: -95,
              }
          },
      },
  },
  {
      breakpoint: 992,
      options: {
          grid: {
              padding: {
                  right: -69,
              }
          },
      },
  }
  ],
  yaxis: {
      labels: {
          formatter: function (value) {
              return value + "K";
          }
      },
      axisBorder: {
          low: 0,
          offsetX: 0,
          show: false,
      },
      axisTicks: {
          show: false,
      },
      crosshairs: {
          show: false,
      },
  },
  xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",],
      range: undefined,
      axisBorder: {
          low: 0,
          offsetX: 0,
          show: false,
      },
      axisTicks: {
          show: false,
      },
      crosshairs: {
          show: true,
          position: 'back',
          stroke: {
              color: '#ff5c41',
              width: 1,
              dashArray: 0,
          },
      },
  },
  tooltip: {
      formatter: undefined,
  },
};
export default {options , series , options2 , options3 , earningsoption ,useroptions , revenue , incomechart}