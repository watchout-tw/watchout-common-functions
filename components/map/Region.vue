<template>
<div class="atlas-with-draw atlas-regions-region tcl-panel half-width">
  <div class="label">{{ option.label }}</div>
  <div class="score">
    <span class="value">{{ score }}</span>
    <span class="unit">%</span>
  </div>
  <div class="draw" :class="{ debug }">
    <svg :viewBox="viewBox"></svg>
  </div>
</div>
</template>

<script>
import * as d3 from 'd3'
import { makeLabel, tightlyPack } from 'watchout-common-functions/lib/d3Exten'

d3.selection.prototype.makeLabel = makeLabel
d3.selection.prototype.tightlyPack = tightlyPack

export default {
  props: ['rows', 'groupBy', 'option', 'debug'],
  data() {
    return {
      el: {
        container: null,
        root: null
      },
      size: {
        w: 320,
        h: 320,
        lineHeight: 1.25
      },
      score: 0
    }
  },
  computed: {
    viewBox() {
      return [0, 0, this.size.w, this.size.h].join(' ')
    },
    filteredRows() {
      return this.rows.filter(row => row[this.groupBy] === this.option.value)
    }
  },
  mounted() {
    this.el.container = d3.select(this.$el).select('.draw')
    this.el.root = this.el.container.select('svg')
    this.draw()
  },
  methods: {
    draw() {
      let quotes = this.el.root.selectAll('g.quote').data(this.filteredRows)
      quotes.exit().remove()
      quotes.enter().append('g').merge(quotes)
        .attr('class', 'quote')
        .makeLabel({
          maxWidth: 8,
          padding: {
            x: 0.5,
            y: 0.25
          },
          lineHeight: this.size.lineHeight
        })
        .tightlyPack({
          max: {
            x: this.size.w - 16,
            y: this.size
          },
          margin: {
            x: 4,
            y: 4
          }
        })

      this.score = (this.filteredRows.length > 0
        ? Math.round(this.el.root.selectAll('g.quote.yes').size() / this.filteredRows.length * 100)
        : 0
      )

      let height = 0
      this.el.root.selectAll('g.quote').each(function(d) {
        let box = this.getBBox()
        let translate = /translate\(([\d.]+),([\d.]+)\)/.exec(this.getAttribute('transform'))
        let y = parseFloat(translate[2])
        height = Math.max(height, Math.ceil(y + box.height))
      })
      this.size.h = height
    }
  }
}
</script>

<style lang="scss">
@import '~watchout-common-assets/styles/resources';

.atlas-with-draw {
  > .draw {
    $transitionDuration: 0.25s;
    width: 100%;
    > svg {
      width: 100%;
    }
    circle.center {
      fill: none;
      stroke: none;
    }
    g.quote {
      rect {
        fill: $color-musou;
        stroke: none;
        opacity: 0.25;
        transition: opacity $transitionDuration;
      }
      text {
        fill: black;
        opacity: 0.75;
        transition: opacity $transitionDuration;
        &.media {
          font-size: 0.65rem;
          font-weight: bold;
        }
        &.and {
          opacity: 0.5;
          font-size: 0.75rem;
          font-weight: bold;
        }
      }
    }
    g.quote:hover {
      rect {
        opacity: 0.85;
      }
      text {
        opacity: 1;
        &.and {
          opacity: 0.5;
        }
      }
    }
    g.quote.yes {
      rect {
        fill: $color-watchout;
      }
    }
  }

  > .draw.debug {
    circle.center {
      fill: $color-musou;
      stroke: none;
    }
    g.quote {
      rect {
        fill: none;
        stroke: $color-musou;
      }
      text {
        opacity: 0.25;
      }
    }
  }
}

.atlas-regions-region {
  > .score {
    line-height: 2rem;
    > .value {
      font-size: 2rem;
    }
    > .unit {
      margin-left: 0.125rem;
    }
  }
  > .draw {
    margin: 0.25rem 0;
  }
}
</style>
