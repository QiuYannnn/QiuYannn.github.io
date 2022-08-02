/**
 * @author Yanhao Qiu
 * @description: Load the CSV file, process the data, and define the data required by the three scenes as year1data year2data year3data respectively.
 * @date 2022-07-29 19:20
 */
d3.csv("./sales-cars.csv", (data) => {
    console.log("data = ", data)
    let year1Data = data.slice(0, 12);
    year1Data = year1Data.map((v) => {
        return {
            label: v.Month.split('-')[1],
            value: v.Sales
        };
    })
    let year2Data = data.slice(12, 24);
    year2Data = year2Data.map((v) => {
        return {
            label: v.Month.split('-')[1],
            value: v.Sales
        };
    })
    let year3Data = data.slice(24, 36);
    year3Data = year3Data.map((v) => {
        return {
            label: v.Month.split('-')[1],
            value: v.Sales
        };
    })
    // console.log("year1Data = ", year1Data)
    // console.log("year2Data = ", year2Data)
    // console.log("year3Data = ", year3Data)
    /**
     * @author Yanhao Qiu
     * @description: Load the first scene by default.
     * @date 2022-07-29 20:20
     */
    const annotations2016 = [{
        note: {
            title: "November"
        },
        x: 450,
        y: 200,
        dy: -100,
        dx: -50
    }]
    const annotations2017 = [{
        note: {
            title: "October"
        },
        x: 418,
        y: 145,
        dy: -50,
        dx: -10
    }]
    const annotations2018 = [{
        note: {
            title: "November"
        },
        x: 450,
        y: 70,
        dy: -20,
        dx: -100
    }]
    renderChart(year1Data, 2016, annotations2016);
    let btnArr = document.getElementsByClassName("btn");
    console.log("btn = ", btnArr)
    /**
     * @author Yanhao Qiu
     * @description: Bind click events to the year list on the right to switch scenes.
     * @date 2022-07-29 20:42
     */
    for (let i = 0; i < btnArr.length; i++) {

        btnArr[i].onclick = function () {
            document.getElementsByClassName("btnActive")[0].classList.remove("btnActive");
            btnArr[i].classList.add("btnActive");
            let dArr = document.getElementsByClassName("centerBottomLeftBottom");
            // console.log(dArr)
            for (let i = 0; i < dArr.length; i++) {
                dArr[i].style.display = 'none';
            }
            dArr[i].style.display = 'block';

            d3
                .select('.myLine').html('')
            if (i == 0) {
                renderChart(year1Data, 2016, annotations2016);
            }
            if (i == 1) {
                renderChart(year2Data, 2017, annotations2017);
            }
            if (i == 2) {
                renderChart(year3Data, 2018, annotations2018);
            }
        }
    }

})
/**
 * @author Yanhao Qiu
 * @description: We have defined a chart rendering function, and the parameters are chart data chartdata and current year respectively.
 * @date 2022-07-28 10:24
 */
function renderChart(chartData, year, annotations) {
    var width = 450 + 100
    var height = 480
    var margin = 20
    /**
     * @author Yanhao Qiu
     * @description: Draw the x-axis and Y-axis of the chart, and define the background style of the chart.
     * @date 2022-07-28 18:24
     */

    var svg = d3
        .select('.myLine')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background-color', '#1a3055')

    var chart = svg.append('g').attr('transform', `translate(${margin * 5}, ${margin})`)
    setTimeout(() => {
        // Add annotation to the chart
        const makeAnnotations = d3.annotation()
            .annotations(annotations)
        d3.select("svg")
            .append("g")
            .call(makeAnnotations)

    }, 2000)
    var xScale = d3
        .scaleBand()
        .range([0, 400])
        .domain(chartData.map((s) => s.label))

    var yScale = d3.scaleLinear().range([400, 0]).domain([0, 600])

    const xAxis = d3.axisBottom(xScale)
    chart.append('g').attr('class', 'xAxis').attr('transform', `translate(0, ${400})`).call(xAxis)
    const yAxis = d3
        .axisLeft()
        .scale(yScale)
        .tickFormat((d) => {
            return d + ' ten thousand';
        })

    d3.select('.xAxis')
        .append('text')
        .attr('x', 400 / 2 - 12)
        .attr('y', 0)
        .attr('dy', 45)
        .style('font-size', '24px')
        .text(`${year}`)

    chart.append('g').attr('transform', 'translate(0, 0)').call(yAxis)
    d3.selectAll('.myLine text').style('fill', '#fff')
    d3.selectAll('.myLine line').style('stroke', '#fff')
    d3.selectAll('.myLine path').style('stroke', '#fff')

    let items = []
    /**
     * @author Yanhao Qiu
     * @description: Process the data and adapt the chart
     * @date 2022-07-29 20:42
     */
    chartData.forEach((row) => {
        let index = 0
        Object.keys(row).forEach((key) => {
            if (key !== 'label') {
                if (items[index]) {
                    items[index].push([row.label, row[key], key, index])
                } else {
                    items[index] = [
                        [row.label, row[key], key, index]
                    ]
                }
                index++
            }
        })
    })
    /**
     * @author Yanhao Qiu
     * @description: According to the incoming data of the chart, draw the vertices of the chart polyline and the polyline connection
     * @date 2022-07-29 21:03
     */
    let line = d3
        .line()
        .x(function (d) {
            return d[0]
        })
        .y(function (d) {
            return d[1]
        })

    const groups = chart.selectAll().data(items)

    const lines = groups
        .enter()
        .append('g')
        .selectAll()
        .data((d) => [d])

    lines
        .enter()
        .append('path')
        .attr('class', 'lines')
        .attr('d', function (d) {
            const row = d.map((item) => {
                const itemS = []
                itemS.push(xScale(item[0]))
                itemS.push(yScale(item[1]))
                return [...itemS]
            })
            return line(row)
        })
        .attr('stroke', (d, i) => '#4385F4')
        .attr('fill', 'none')
        .attr('transform', `translate(${xScale.bandwidth() / 2}, 0)`)

    const circles = groups
        .enter()
        .append('g')
        .attr('class', 'Gcircle')
        .selectAll()
        .data((d) => d)

    circles
        .enter()
        .append('circle')
        .attr('cx', function (d) {
            return xScale(d[0])
        })
        .attr('cy', function (d) {
            return yScale(d[1])
        })
        .attr('r', 4)
        .attr('transform', `translate(${xScale.bandwidth() / 2}, 0)`)
        .attr('fill', '#fff')
        .attr('stroke', 'rgba(56, 8, 228, .5)');


    circles
        .enter()
        .append('text')
        .attr('x', function (d) {
            return xScale(d[0]) - 10
        })
        .attr('y', function (d) {
            return yScale(d[1]) - 5
        }).style('font-size', '12px').attr('transform', `translate(${xScale.bandwidth() / 2}, 0)`).attr('fill', '#fff').text(function (d) {
            console.log("d3 = ", d)
            return d[1];
        })

    const generateArea = d3
        .area()
        .x((d) => d[0])
        .y0((d) => d[1])
        .y1((d) => 400)

    lines
        .enter()
        .append('path')
        .attr('class', 'area')
        .attr('fill', (d, i) => '#4385F4')
        .attr('fill-opacity', '0.5')
        .attr('transform', `translate(${xScale.bandwidth() / 2}, 0)`)

    /**
     * @author Yanhao Qiu
     * @description: Encapsulated chart animation.
     * @date 2022-07-29 08:24
     */
    function animate(pointX, pointY) {
        const domain = d3.range(0, 1, 1 / (pointX.length - 1))
        domain.push(1)
        const interpolateX = d3.scaleLinear().domain(domain).range(pointX)
        const interpolateY = d3.scaleLinear().domain(domain).range(pointY)
        return {
            x: interpolateX,
            y: interpolateY
        }
    }

    d3.selectAll('path.lines')
        .transition()
        .duration(2000)
        .attrTween('d', (_d) => {
            const pointX = _d.map((d) => xScale(d[0]))
            const pointY = _d.map((d) => yScale(d[1]))

            const interpolate = animate(pointX, pointY)
            const ponits = []

            return function (t) {
                ponits.push([interpolate.x(t), interpolate.y(t)])
                return line(ponits)
            }
        })
    /**
     * @author Yanhao Qiu
     * @description: Draw the area block below the broken line of the chart.
     * @date 2022-07-29 08:24
     */

    d3.selectAll('path.area')
        .transition()
        .duration(2000)
        .attrTween('d', (_d) => {
            const pointX = _d.map((d) => xScale(d[0]))
            const pointY = _d.map((d) => yScale(d[1]))

            const interpolate = animate(pointX, pointY)
            const ponits = []

            return function (t) {
                ponits.push([interpolate.x(t), interpolate.y(t)])
                return generateArea(ponits)
            }
        })



    d3.selectAll('.Gcircle')
        .selectAll('circle')
        .attr('r', 0)
        .transition()
        .duration(300)
        .delay(function (d, i) {
            return (i * 2000) / chartData.length
        })
        .attr('r', 4)
        .style('stroke-width', 3)

    d3.selectAll('.Gcircle')
        .selectAll('text')
        .style('opacity', 0)
        .transition()
        .duration(300)
        .delay(function (d, i) {
            return (i * 2000) / chartData.length
        })
        .style('opacity', 1)



}
