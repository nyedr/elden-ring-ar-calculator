import useDemoConfig from "@/hooks/useDemoConfig";
import { randomColor } from "@/lib/uiUtils";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { AxisOptions, Chart } from "react-charts";

export type ChartItem = {
  label: string;
  data: {
    primary: string | number | Date | null;
    secondary: number | null;
    radius?: number | undefined;
  }[];
};

export type ChartData = ChartItem[];

interface DynamicChartProps {
  elementType: "line" | "area" | "bar";
  activeDatumIndex: number;
  activeSeriesIndex: number;
  setState: React.Dispatch<
    React.SetStateAction<{
      activeSeriesIndex: number;
      activeDatumIndex: number;
    }>
  >;
  data: ChartData;
  removeChartItem?: (name: string) => void;
  lineColors?: string[];
}

export default function DynamicStyledChart({
  elementType,
  activeDatumIndex,
  activeSeriesIndex,
  setState,
  data,
  removeChartItem,
  lineColors,
}: DynamicChartProps) {
  const { interactionMode } = useDemoConfig({
    series: 4,
    interactionMode: "primary",
    dataType: "linear",
    show: ["elementType", "interactionMode"],
  });
  const { theme } = useTheme();

  const templateColors = React.useMemo<string[]>(
    () => data.map(() => randomColor()),
    [data]
  );

  const [colors, setColors] = useState<string[]>(templateColors);

  useEffect(() => {
    setColors((prev) => {
      const newColors = data.map((_, index) => prev[index] || randomColor());
      return newColors;
    });
  }, [data]);

  const primaryAxis = React.useMemo<
    AxisOptions<(typeof data)[number]["data"][number]>
  >(
    () => ({
      getValue: (datum) => datum.primary,
    }),
    []
  );

  const secondaryAxes = React.useMemo<
    AxisOptions<(typeof data)[number]["data"][number]>[]
  >(
    () => [
      {
        getValue: (datum) => datum.secondary,
        elementType,
      },
    ],
    [elementType]
  );

  return (
    <div className="flex-[2] max-h-[500px] relative m-0 sm:m-4">
      <div className="w-full mb-3 flex flex-wrap items-center gap-3 justify-evenly">
        {data.map((d, i) => (
          <div
            key={i}
            onClick={() => {
              if (removeChartItem == null) return;
              removeChartItem(d.label);
              setColors((prev) => prev.filter((_, index) => i !== index));
            }}
            className={cn(
              `flex text-sm items-center gap-2 ${
                removeChartItem ? "cursor-pointer hover:opacity-75" : null
              } select-none`,
              i !== activeSeriesIndex && activeSeriesIndex !== -1
                ? "opacity-30"
                : ""
            )}
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{
                background: `${lineColors == null ? colors[i] : lineColors[i]}`,
              }}
            />
            <span>{d.label}</span>
          </div>
        ))}
      </div>
      <Chart
        options={{
          data,
          dark: theme === "dark",
          interactionMode,
          primaryAxis,
          secondaryAxes,
          getDatumStyle: (datum, status) =>
            (activeDatumIndex === datum.index &&
            activeSeriesIndex === datum.seriesIndex
              ? {
                  opacity: 1,
                  circle: {
                    r: 5,
                  },
                  rectangle: {
                    stroke: "black",
                    strokeWidth: 3,
                  },
                }
              : activeDatumIndex === datum.index
              ? {
                  opacity: 1,
                  circle: {
                    r: 3,
                  },
                  rectangle: {
                    stroke: "black",
                    strokeWidth: 1,
                  },
                }
              : datum.seriesIndex === activeSeriesIndex
              ? {
                  circle: {
                    r: 3,
                  },
                  rectangle: {
                    stroke: "black",
                    strokeWidth: 1,
                  },
                }
              : status === "groupFocused"
              ? {
                  circle: {
                    r: 2,
                  },
                  rectangle: {
                    stroke: "black",
                    strokeWidth: 0,
                  },
                }
              : {
                  circle: {
                    r: 2,
                  },
                  rectangle: {
                    stroke: "black",
                    strokeWidth: 0,
                  },
                }) as any,
          getSeriesStyle: (series) => {
            return {
              color: `url(#${series.index % 4})`,
              opacity:
                activeSeriesIndex > -1
                  ? series.index === activeSeriesIndex
                    ? 1
                    : 0.3
                  : 1,
            };
          },
          onFocusDatum: (focused) =>
            setState({
              activeSeriesIndex: focused ? focused.seriesIndex : -1,
              activeDatumIndex: focused ? focused.index : -1,
            }),

          renderSVG: () => (
            <defs>
              {(lineColors == null ? colors : lineColors).map(
                (color, index) => (
                  <linearGradient
                    key={index}
                    id={`${index}`}
                    x1="0"
                    x2="0"
                    y1="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor={color} />
                    <stop offset="100%" stopColor={color} />
                  </linearGradient>
                )
              )}
            </defs>
          ),
        }}
      />
    </div>
  );
}
