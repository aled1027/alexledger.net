<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";

  function init() {
    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
      width = 1080 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3
      .select("#my_dataviz")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    //Read the data
    d3.csv(
      // "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/connectedscatter.csv",
      "https://gist.githubusercontent.com/aled1027/51f44def9d70c3ac19ec37860d562869/raw/1dc350ffee6eb2e4b4fd939a75c3755e6e1325de/fake.csv",
      // When reading the csv, I must format variables:
      function (d) {
        return {
          date: d3.timeParse("%Y-%m-%d")(d.date),
          value: parseFloat(d.value),
        };
      }
    ).then(
      // Now I can use this dataset:
      function (data) {
        console.log(data);

        const yMin = d3.min(data.map((item) => parseInt(item.value))) * 0.8;
        const yMax = d3.max(data.map((item) => parseInt(item.value))) * 1.1;

        // Add X axis --> it is a date format
        const x = d3
          .scaleTime()
          .domain(d3.extent(data, (d) => d.date))
          .range([0, width]);
        svg
          .append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));
        // Add Y axis
        const y = d3.scaleLinear().domain([yMin, yMax]).range([height, 0]);
        svg.append("g").call(d3.axisLeft(y));
        // Add the line
        svg
          .append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "#69b3a2")
          .attr("stroke-width", 1.5)
          .attr(
            "d",
            d3
              .line()
              .x((d) => x(d.date))
              .y((d) => y(d.value))
          );
        // Add the points
        svg
          .append("g")
          .selectAll("dot")
          .data(data)
          .join("circle")
          .attr("cx", (d) => x(d.date))
          .attr("cy", (d) => y(d.value))
          .attr("r", 5)
          .attr("fill", "#69b3a2");
      }
    );
  }

  onMount(() => init());
</script>

<div id="my_dataviz"></div>
