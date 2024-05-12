/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

@Component({
  selector: 'lib-bar-chart-race',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bar-chart-race.component.html',
  styleUrl: './bar-chart-race.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartRaceComponent implements AfterViewInit {
  @ViewChild('chart', { static: true }) myElementRef!: ElementRef;

  public async ngAfterViewInit() {
    const chartElement: HTMLElement = this.myElementRef.nativeElement;
    const width: number = chartElement.offsetWidth;
    const margin = { top: 16, right: 6, bottom: 6, left: 0 };
    const barSize = 48;
    const n = 12;
    const k = 10;
    const duration = 250;
    const height: number = margin.top + barSize * n + margin.bottom;

    d3.csv('assets/data/brands.csv').then((data: any) => {
      this.draw(
        data,
        chartElement,
        width,
        height,
        margin,
        barSize,
        n,
        k,
        duration
      );
    });
  }

  public async draw(
    data: any,
    chartElement: HTMLElement,
    width: number,
    height: number,
    margin: any,
    barSize: number,
    n: number,
    k: number,
    duration: number
  ) {
    const keyframes: any = [];
    const formatNumber = d3.format(',d');
    const formatDate = d3.utcFormat('%Y');
    const x = d3.scaleLinear([0, 1], [margin.left, width - margin.right]);
    const y = d3
      .scaleBand()
      .domain(d3.range(n + 1) as any)
      .rangeRound([margin.top, margin.top + barSize * (n + 1 + 0.1)])
      .padding(0.1);
    const names = new Set(data.map((d: any) => d.name));
    const datevalues = Array.from(
      d3.rollup(
        data,
        ([d]: any) => +d.value,
        (d: any) => d.date,
        (d) => d.name
      )
    )
      .map(([date, data]: any) => [new Date(date), data])
      .sort(([a]: any, [b]: any) => d3.ascending(a, b));

    const usedColors = new Set<string>();
    const nameframes = d3.groups(
      keyframe().flatMap(([, data]: any) => data),
      (d: any) => d.name
    );
    const prev = new Map(
      nameframes.flatMap(([, data]: any) => d3.pairs(data, (a, b) => [b, a]))
    );
    const next = new Map(nameframes.flatMap(([, data]: any) => d3.pairs(data)));
    const svg = d3.create('svg').attr('viewBox', [0, 0, width, height]);
    const updateBars = bars(svg);
    const updateAxis = axis(svg);
    const updateLabels = labels(svg);
    const updateTicker = ticker(svg);
    chartElement.appendChild(svg.node()!);

    for (const keyframe of keyframes) {
      const transition = svg
        .transition()
        .duration(duration)
        .ease(d3.easeLinear);

      // Extract the top bar’s value.
      x.domain([0, keyframe[1][0].value]);
      updateAxis(keyframe, transition);
      updateBars(keyframe, transition);
      updateLabels(keyframe, transition);
      updateTicker(keyframe, transition);
      await transition.end();
    }

    function rank(value) {
      const data: any = Array.from(names, (name) => ({
        name,
        value: value(name),
      }));
      data.sort((a, b) => d3.descending(a.value, b.value));
      for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(n, i);
      return data;
    }

    function keyframe() {
      let ka, a, kb, b;
      for ([[ka, a], [kb, b]] of d3.pairs(datevalues)) {
        for (let i = 0; i < k; ++i) {
          const t = i / k;
          keyframes.push([
            new Date(ka * (1 - t) + kb * t),
            rank(
              (name) => (a.get(name) || 0) * (1 - t) + (b.get(name) || 0) * t
            ),
          ]);
        }
      }
      keyframes.push([new Date(kb), rank((name) => b.get(name) || 0)]);
      return keyframes;
    }

    function bars(svg) {
      let bar = svg.append('g').attr('fill-opacity', 0.6).selectAll('rect');

      return ([date, data], transition) =>
        (bar = bar
          .data(data.slice(0, n), (d) => d.name)
          .join(
            (enter) =>
              enter
                .append('rect')
                .attr('fill', color)
                .attr('height', y.bandwidth())
                .attr('x', x(0))
                .attr('y', (d) => y((prev.get(d) || d).rank))
                .attr('width', (d) => x((prev.get(d) || d).value) - x(0)),
            (update) => update,
            (exit) =>
              exit
                .transition(transition)
                .remove()
                .attr('y', (d) => y((next.get(d) || d).rank))
                .attr('width', (d) => x((next.get(d) || d).value) - x(0))
          )
          .call((bar) =>
            bar
              .transition(transition)
              .attr('y', (d) => y(d.rank))
              .attr('width', (d) => x(d.value) - x(0))
          ));
    }

    function labels(svg) {
      let label = svg
        .append('g')
        .style('font', 'bold 12px var(--sans-serif)')
        .style('font-variant-numeric', 'tabular-nums')
        .attr('text-anchor', 'end')
        .selectAll('text');

      return ([date, data], transition) =>
        (label = label
          .data(data.slice(0, n), (d) => d.name)
          .join(
            (enter) =>
              enter
                .append('text')
                .attr(
                  'transform',
                  (d) =>
                    `translate(${x((prev.get(d) || d).value)},${y(
                      (prev.get(d) || d).rank
                    )})`
                )
                .attr('y', y.bandwidth() / 2)
                .attr('x', -6)
                .attr('dy', '-0.25em')
                .text((d) => d.name)
                .call((text) =>
                  text
                    .append('tspan')
                    .attr('fill-opacity', 0.7)
                    .attr('font-weight', 'normal')
                    .attr('x', -6)
                    .attr('dy', '1.15em')
                ),
            (update) => update,
            (exit) =>
              exit
                .transition(transition)
                .remove()
                .attr(
                  'transform',
                  (d) =>
                    `translate(${x((next.get(d) || d).value)},${y(
                      (next.get(d) || d).rank
                    )})`
                )
                .call((g) =>
                  g
                    .select('tspan')
                    .tween('text', (d) =>
                      textTween(d.value, (next.get(d) || d).value)
                    )
                )
          )
          .call((bar) =>
            bar
              .transition(transition)
              .attr('transform', (d) => `translate(${x(d.value)},${y(d.rank)})`)
              .call((g) =>
                g
                  .select('tspan')
                  .tween('text', (d) =>
                    textTween((prev.get(d) || d).value, d.value)
                  )
              )
          ));
    }

    function axis(svg) {
      const g = svg.append('g').attr('transform', `translate(0,${margin.top})`);

      const axis = d3
        .axisTop(x)
        .ticks(width / 160)
        .tickSizeOuter(0)
        .tickSizeInner(-barSize * (n + y.padding()));

      return (_, transition) => {
        g.transition(transition).call(axis);
        g.select('.tick:first-of-type text').remove();
        g.selectAll('.tick:not(:first-of-type) line').attr('stroke', 'none');
        g.select('.domain').remove();
      };
    }

    function ticker(
      svg: d3.Selection<SVGSVGElement, undefined, null, undefined>
    ) {
      const now = svg
        .append('text')
        .style('font', `bold ${barSize}px var(--sans-serif)`)
        .style('font-variant-numeric', 'tabular-nums')
        .attr('text-anchor', 'end')
        .attr('x', width - 6)
        .attr('y', margin.top + barSize * (n - 0.45))
        .attr('dy', '0.32em')
        .text(formatDate(keyframes[0][0]));

      return ([date], transition) => {
        transition.end().then(() => now.text(formatDate(date)));
      };
    }

    function textTween(a: any, b: any) {
      const i = d3.interpolateNumber(a, b);
      return function (this: SVGTextElement, t: any) {
        d3.select(this).text(formatNumber(i(t)));
      };
    }

    function color(d: any) {
      const generateUniqueColor = () => {
        let color = '';
        do {
          color = d3.interpolateRainbow(Math.random());
        } while (usedColors.has(color));
        usedColors.add(color);
        return color;
      };

      const color = d3.schemePaired.slice(0, 12)[d.rank];
      // var color = d3.interpolateRainbow(d.rank / (n - 1));
      if (usedColors.has(color)) {
        return generateUniqueColor();
      } else {
        usedColors.add(color);
        return color;
      }
    }
  }
}
