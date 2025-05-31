import { useRef, useEffect } from 'react'
import * as d3 from 'd3';
import Box from '@mui/material/Box';

import useAppStore from './store';
import { Isotope } from './Element';

interface GroupedIsotopes {
  total: number;
  isotopes: Isotope[];
}

interface InnerArcDatumData extends Isotope {
  parent: d3.PieArcDatum<[string, GroupedIsotopes]>;
}

const Plot: React.FC = () => {
    const ref = useRef<SVGSVGElement>(null);
    const { selected } = useAppStore();

    useEffect(() => {
        if (!selected || !ref.current) return;

        const width = 400;
        const height = 400;
        const outerRadius = Math.min(width, height) / 2 - 10;
        const innerRadius = outerRadius * 0.7;

        d3.select(ref.current).selectAll('*').remove();

        const svg = d3.select(ref.current)
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', `translate(${width / 2},${height / 2})`);

        const validIsotopes = selected.isotopes.filter((iso: Isotope) => iso.isotopic_composition > 0);

        const spinGroups = Array.from(d3.group(validIsotopes, (d: Isotope) => d.spin.label))
          .sort((a: [string, Isotope[]], b: [string, Isotope[]]) => {
              const totalA = d3.sum(a[1], (d: Isotope) => d.isotopic_composition);
              const totalB = d3.sum(b[1], (d: Isotope) => d.isotopic_composition);
              return totalB - totalA;
          })
          .map((([spinLabel, group]: [string, Isotope[]]) => ([
            spinLabel, {
              total: d3.sum(group, (d: Isotope) => d.isotopic_composition),
              isotopes: group.sort((a: Isotope, b: Isotope) => a.mass_number - b.mass_number)
            }
          ])));

        const spinPie = d3.pie<[string, GroupedIsotopes]>()
          .value((d: [string, GroupedIsotopes]) => d[1].total);

        const isotopePie = d3.pie<InnerArcDatumData>()
          .value((d: InnerArcDatumData) => d.isotopic_composition);

        const outerArc = d3.arc<d3.PieArcDatum<[string, GroupedIsotopes]>>()
          .innerRadius(innerRadius * 1.1)
          .outerRadius(outerRadius * 1.1);

        const innerArc = d3.arc<d3.PieArcDatum<InnerArcDatumData>>()
          .innerRadius(innerRadius)
          .outerRadius(innerRadius * 1.05);

        const spinColor = d3.scaleOrdinal<string>()
          .domain(spinGroups.map(([label]) => label as string))
          .range(d3.schemeCategory10);

        const isotopeColor = d3.scaleOrdinal<string>()
          .domain(validIsotopes.map((iso: Isotope) => iso.nucleus))
          .range(d3.schemeDark2);

        const spinArcs = svg.selectAll<SVGGElement, unknown>(".spin-arc")
          .data(spinPie(spinGroups as [string, GroupedIsotopes][]))
          .enter().append("g")
          .attr("class", "spin-arc");

        spinArcs.append("path")
          .attr("d", (d) => outerArc(d))
          .attr("fill", (d: d3.PieArcDatum<[string, GroupedIsotopes]>) => spinColor(d.data[0]));

        spinArcs.append("text")
          .attr("transform", (d: d3.PieArcDatum<[string, GroupedIsotopes]>) => `translate(${outerArc.centroid(d)})`)
          .attr("dy", "0.35em")
          .text((d: d3.PieArcDatum<[string, GroupedIsotopes]>) => `${d.data[0]} (${(d.data[1].total * 100).toFixed(1)}%)`);

        const isotopeArcs = spinArcs.selectAll<SVGGElement, d3.PieArcDatum<InnerArcDatumData>>(".isotope-arc")
          .data((d: d3.PieArcDatum<[string, GroupedIsotopes]>) => isotopePie(d.data[1].isotopes.map(iso => ({ ...iso, parent: d }))))
          .enter().append("g")
          .attr("class", "isotope-arc");

        isotopeArcs.append("path")
          .attr("d", (d) => innerArc(d))
          .attr("fill", (d: d3.PieArcDatum<InnerArcDatumData>) => isotopeColor(d.data.nucleus));

        isotopeArcs.append("text")
          .attr("transform", (d: d3.PieArcDatum<InnerArcDatumData>) => `translate(${innerArc.centroid(d)})`)
          .attr("dy", "0.35em")
          .text((d: d3.PieArcDatum<InnerArcDatumData>) => d.data.mass_number.toString());

    }, [selected]);

    return (
        <Box>
            <svg ref={ref} width={400} height={400}></svg>
        </Box>
    )
}

export default Plot;
