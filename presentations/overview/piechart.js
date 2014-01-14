
				$('#container').highcharts({
					chart: {
						plotBackgroundColor: null,
						plotBorderWidth: null,
						plotShadow: false,
						backgroundColor: null,
						style: {
							fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif', // default font
							fontSize: '22px'
						}
					},
					title: {
						text: null
					},
					tooltip: {
						headerFormat: '<strong>{point.key}</strong><br>',
						pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
						style: {
							fontFamily: 'Lato, sans-serif',
							fontSize: '16px'
						}
					},
					plotOptions: {
						pie: {
							allowPointSelect: true,
							cursor: 'pointer',
							dataLabels: {
								enabled: true,
								format: '<b>{point.name}</b>: {point.percentage:.1f} %',
								style: {
									fontFamily: 'Lato, sans-serif',
									fontSize: '20px'
								}
							},
							events: {
								click: function(event) {
									Reveal.slide(2, 1+event.point.x);
								}
							}
						}
					},
					series: [{
						type: 'pie',
						name: 'Browser share',
						data: [
							['Firefox',   45.0], // x= 0
							['IE',       26.8], // x= 1
							{
								name: 'Chrome',
								y: 12.8,
								sliced: true,
								selected: true
							},
							['Safari',    8.5],
							['Opera',     6.2],
							['Others',   0.7]
						],
					}]
				});
