import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  GET_STATE,
  GET_DENSITY,
  SET_DENSITY,
  GET_CURRENT_RULE,
  SET_RULE,
  GET_ENVIRONMENT,
  STEP_FORWARD
} from "../queries";
import { Rule, Cell, Pattern } from "../types";

///////////
// Views //
///////////

const ViewCell = ({ alive }: { alive: Cell }) => {
  if (alive) {
    return (
      <div className="w-4 h-4 rounded-full shadow-md bg-green-600 flex-shrink-0"></div>
    );
  } else {
    return (
      <div className="w-4 h-4 rounded-full shadow-inner bg-gray-400 flex-shrink-0"></div>
    );
  }
};

const ViewRow = ({ row }: { row: Cell[] }) => {
  return (
    <div className="flex flex-row">
      {row.map((cell: Cell) => {
        return <ViewCell alive={cell} />;
      })}
    </div>
  );
};

export const ViewEnvironment = () => {
  const { loading, error, data } = useQuery<{
    getEnvironment: { environment: Cell[][] };
  }>(GET_ENVIRONMENT);

  if (loading) {
    console.log("loading");
    return <p>loading...</p>;
  } else if (data) {
    console.log(data);
    return (
      <div className="bg-gray-200 m-4 p-2 rounded-lg shadow-xl border-2 border-gray-400">
        {data.getEnvironment.environment.map((row: Cell[]) => {
          return <ViewRow row={row} />;
        })}
      </div>
    );
  } else if (error) {
    console.log(error);
  }

  return <p>Something broke...</p>;
};

type DropdownType<T> = {
  label: string;
  options: T[];
  initial: T | undefined;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const Dropdown = ({
  label,
  options,
  initial,
  handleChange
}: DropdownType<string | number>) => {
  return (
    <div className="flex flex-row bg-gray-200 rounded-lg m-4 px-2 py-0 text-center items-center border-2 border-gray-400">
      <div>{label}</div>
      <form>
        <select
          className="appearance-none m-2 p-1 rounded-lg text-center bg-gray-400 shadow-lg justify-end"
          value={initial}
          onChange={handleChange}
        >
          {options.map(i => {
            return <option value={i}>{i}</option>;
          })}
        </select>
      </form>
    </div>
  );
};

export const ViewTimeControls = () => {
  const [stepForward] = useMutation(STEP_FORWARD);

  const stepForwardCallback = () => {
    stepForward({
      refetchQueries: [{ query: GET_ENVIRONMENT }]
    });
  };

  return (
    <div>
      <button
        className="bg-gray-200 hover:bg-green-400 border-2 border-gray-400 p-2 rounded-l-lg"
        type="button"
      >
        back
      </button>
      <button
        className="bg-gray-200 hover:bg-green-400 border-t-2 border-b-2 border-gray-400 p-2"
        type="button"
      >
        play/pause
      </button>
      <button
        onClick={stepForwardCallback}
        className="bg-gray-200 hover:bg-green-400  border-2 border-gray-400 p-2 rounded-r-lg"
        type="button"
      >
        forward
      </button>
    </div>
  );
};

export const ViewDensityInput = () => {
  const { loading, data } = useQuery<{ density: number }>(GET_DENSITY);

  const [densityState, setLocalDensity] = useState<{
    density: number | undefined;
  }>({
    density: data && data.density
  });

  const [setStateDensity] = useMutation(SET_DENSITY);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalDensity({ density: parseFloat(e.target.value) });
    setStateDensity({
      variables: { density: parseFloat(e.target.value) },
      refetchQueries: [
        {
          query: GET_ENVIRONMENT
        }
      ]
    });
  };

  let all_densities: number[] = [];
  for (let i = 0; i < 11; i++) {
    all_densities.push(i / 10);
  }

  return (
    <Dropdown
      label="Density:"
      options={all_densities}
      initial={densityState.density}
      handleChange={handleChange}
    />
  );
};

export const ViewRuleInput = () => {
  const { loading, data } = useQuery<{ currentRule: number }>(GET_CURRENT_RULE);
  const [ruleState, setRule] = useState<{ currentRule: number | undefined }>({
    currentRule: data && data.currentRule
  });

  const [setCurrentRule] = useMutation(SET_RULE);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRule({ currentRule: parseInt(e.target.value) });
    setCurrentRule({
      variables: { currentRule: parseInt(e.target.value) },
      refetchQueries: [
        {
          query: GET_ENVIRONMENT
        }
      ]
    });
  };

  let allRules: number[] = [];
  for (let i = 0; i < 256; i++) {
    allRules.push(i);
  }

  return (
    <Dropdown
      label="Rule #:"
      options={allRules}
      initial={ruleState.currentRule}
      handleChange={handleChange}
    />
  );
};
