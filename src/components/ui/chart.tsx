import useDemoConfig from "@/hooks/useDemoConfig";
import { useTheme } from "next-themes";
import React from "react";
import { AxisOptions, Chart } from "react-charts";

export type ChartData = {
  label: string;
  data: {
    primary: string | number | Date | null;
    secondary: number | null;
    radius?: number | undefined;
  }[];
}[];

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
}

export default function DynamicStyledChart({
  elementType,
  activeDatumIndex,
  activeSeriesIndex,
  setState,
  data,
}: DynamicChartProps) {
  const { interactionMode } = useDemoConfig({
    series: 4,
    interactionMode: "primary",
    dataType: "linear",
    show: ["elementType", "interactionMode"],
  });
  const { theme } = useTheme();

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
    <div className="flex-[2] max-h-[400px] m-0 sm:m-3 overflow-hidden">
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
              <linearGradient id="0" x1="0" x2="0" y1="1" y2="0">
                <stop offset="0%" stopColor="#17EAD9" />
                <stop offset="100%" stopColor="#6078EA" />
              </linearGradient>
              <linearGradient id="1" x1="0" x2="0" y1="1" y2="0">
                <stop offset="0%" stopColor="#ff8f10" />
                <stop offset="100%" stopColor="#ff3434" />
              </linearGradient>
              <linearGradient id="2" x1="0" x2="0" y1="1" y2="0">
                <stop offset="0%" stopColor="#42E695" />
                <stop offset="100%" stopColor="#3BB2B8" />
              </linearGradient>
              <linearGradient id="3" x1="0" x2="0" y1="1" y2="0">
                <stop offset="0%" stopColor="#ffb302" />
                <stop offset="100%" stopColor="#ead700" />
              </linearGradient>
            </defs>
          ),
        }}
      />
    </div>
  );
}
