import './style.css'
import * as d3 from "d3";

let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
let req = new XMLHttpRequest()

let values = []

let  w = 800
let h = 600
let padding = 40

let xScale 
let yScale 

let svg = d3.select('svg')
let tooltip = d3.select('#tooltip')

let drawBackground = () => {
svg.attr('width', w)
svg.attr('height', h)
}

let createScales = () => {

  xScale = d3.scaleLinear()
  .domain([d3.min(values, (d) => d['Year']) - 1, d3.max(values, (d) => d['Year']) + 1])
 .range([padding, w - padding])

 yScale = d3.scaleTime()
 .domain([d3.min(values, (d) => new Date(d['Seconds'] * 1000)), d3.max(values, (d) => new Date(d['Seconds'] * 1000))])
 .range([padding, h - padding])
}

let createAxis = () => {
let xAxis = d3.axisBottom(xScale)
.tickFormat(d3.format('d'))

let yAxis = d3.axisLeft(yScale)
.tickFormat(d3.timeFormat('%M:%S'))

svg.append('g')
.call(xAxis)
.attr('id', 'x-axis')
.attr('transform', 'translate(0, ' + (h - padding) + ')')


svg.append('g')
.call(yAxis)
.attr('id', 'y-axis')
.attr('transform', 'translate(' + (padding + ', 0)'))
.attr('x', (d) => xScale(d))
}

let drawCircles = () => {
svg.selectAll('circle')
.data(values)
.enter()
.append('circle')
.attr('class', 'dot')
.attr('r', 6)
.attr('data-xvalue', (d) => d['Year'])
.attr('data-yvalue', (d) => new Date(d['Seconds'] * 1000))
.attr('cx', (d) => xScale(d['Year']))
.attr('cy', (d) => yScale(new Date (d['Seconds'] * 1000)))
.attr('fill', (d) => d['Doping'] == "" ? 'blue' : 'red')
.on('mouseover', (event, d) => {
  tooltip.transition()
  .style('visibility', 'visible')
  tooltip.attr('data-year', d['Year'])

  if (values['Doping'] == '') {
    tooltip.html(
      d['Name'] + 
      ': ' +
      d['Nationality'] + 
      '<br />' +
       'Year: ' + 
       d['Year'] +
       '<br />' + 
       'Time: ' +
       d['Time'] 
      )
    .style('left', event.pageX + 'px')
    .style('top', event.pageY - 28 + 'px')
  } else {
      tooltip.html(
        d['Name'] + 
        ': ' +
        d['Nationality'] + 
        '<br />' +
         'Year: ' + 
         d['Year'] +
         '<br />' + 
         'Time: ' +
         d['Time'] + 
         '<br />' +
         d['Doping']
        )
      .style('left', event.pageX + 'px')
      .style('top', event.pageY - 28 + 'px')
  }
  

})
.on('mouseout', (event) => {
  tooltip.transition(1000)
  .style('visibility', 'hidden')
} )
}

req.open('GET', url, true)
req.onload = () => {
 values = JSON.parse(req.responseText)
 console.log(values)
 drawBackground()
 createScales()
 createAxis()
 drawCircles()
}
req.send()



