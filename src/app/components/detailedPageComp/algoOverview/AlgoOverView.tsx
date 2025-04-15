import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAlgoConfig, postAlgoConfig } from "@/features/thunks/algoConfig";
import { RootState, AppDispatch } from "@/features/store/store";
import { AlgoConfigResponse } from "@/features/models/algo-config";
import { EnergyFluxParametersResponse } from "@/features/models/energy-flux-parameters";
import {
  fetchEnergyFlux,
  postEnergyFlux,
} from "@/features/thunks/energyFluxParameters";
import { clearEnergyFluxError } from "@/features/slices/energyFluxSlice";
import { clearAlgoError } from "@/features/slices/algoConfigSlice";

interface AlgoOverviewProps {
  controllerId: string;
}

const AlgoOverView = ({ controllerId }: AlgoOverviewProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);

  const {
    data: algoData,
    loading: algoLoading,
    error: algoError,
  } = useSelector((state: RootState) => state.algoConfig);
  const {
    data: energyFluxData,
    loading: energyFluxLoading,
    error: energyFluxError,
  } = useSelector((state: RootState) => state.energyFlux);

  const algoConfig = algoData[controllerId];
  const energyFlux = energyFluxData[controllerId];
  const error = algoError || energyFluxError;

  // Local states
  const [localAlgoValues, setLocalAlgoValues] = useState<
    Partial<AlgoConfigResponse>
  >(algoConfig || {});
  const [localEnergyFluxValues, setLocalEnergyFluxValues] = useState<
    Partial<EnergyFluxParametersResponse>
  >(energyFlux || { window: 0, wall: 0, offset: 0 });

  useEffect(() => {
    if (algoConfig) {
      setLocalAlgoValues(algoConfig);
    }
  }, [algoConfig]);

  useEffect(() => {
    if (energyFlux) {
      setLocalEnergyFluxValues(energyFlux);
    }
  }, [energyFlux]);

  const hasAlgoData = useMemo(
    () => Boolean(algoConfig && Object.keys(algoConfig).length > 0),
    [algoConfig]
  );
  const hasEnergyFluxData = useMemo(
    () => Boolean(energyFlux && Object.keys(energyFlux).length > 0),
    [energyFlux]
  );

  const editableAlgoFields = ["sun_constant", "comfort_constant", "iat_sp"];
  const editableEnergyFluxFields = ["window", "wall", "offset"];

  const handleChange = (
    key: string,
    value: string,
    type: "algo" | "energyFlux"
  ) => {
    const parsedValue = value === "" ? "" : Number(value);
    if (type === "algo") {
      setLocalAlgoValues((prev) => ({ ...prev, [key]: parsedValue }));
    } else {
      setLocalEnergyFluxValues((prev) => ({ ...prev, [key]: parsedValue }));
    }
  };

  const handleUpdate = async (field: string, type: "algo" | "energyFlux") => {
    setIsUpdating(true);
    try {
      if (type === "algo") {
        await dispatch(
          postAlgoConfig({
            controllerId,
            comfortConstant: Number(localAlgoValues.comfort_constant) || 0,
            sunConstant: Number(localAlgoValues.sun_constant) || 0,
            iatSp: Number(localAlgoValues.iat_sp) || 0,
          })
        ).unwrap();
      } else {
        await dispatch(
          postEnergyFlux({
            controllerId,
            window: Number(localEnergyFluxValues.window) || 0,
            wall: Number(localEnergyFluxValues.wall) || 0,
            offset: Number(localEnergyFluxValues.offset) || 0,
          })
        ).unwrap();
      }

      // Refresh data
      await handleFetchConfig();
      setEditingField(null);
    } catch (error) {
      console.error(`Error updating ${type} parameters:`, error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFetchConfig = useCallback(() => {
    dispatch(fetchAlgoConfig({ controllerId }));
    dispatch(fetchEnergyFlux({ controllerId }));
  }, [controllerId, dispatch]);

  useEffect(() => {
    if (!controllerId) return;
    dispatch(clearAlgoError());
    dispatch(clearEnergyFluxError());
    handleFetchConfig();
  }, [controllerId, dispatch, handleFetchConfig]);

  if (algoLoading || energyFluxLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  const showNotFound =
    (algoConfig === null && energyFlux === null) ||
    (!algoConfig && !energyFlux);

  if (showNotFound) {
    return null;
  }

  return (
    <div className="rounded-lg bg-darkBg border border-neonBlue p-6 w-fit mx-auto flex flex-col">
      <div className="flex flex-col gap-8 p-10">
        {algoConfig && (
          <Section
            type="algo"
            title="Algo Parameters"
            config={algoConfig}
            hasData={hasAlgoData}
            localValues={localAlgoValues}
            editableFields={editableAlgoFields}
            onChange={(key, value) => handleChange(key, value, "algo")}
            onUpdate={(field) => handleUpdate(field, "algo")}
            editingField={editingField}
            setEditingField={setEditingField}
          />
        )}

        {energyFlux && (
          <Section
            type="energyFlux"
            title="EnergyFlux Parameters"
            config={energyFlux}
            hasData={hasEnergyFluxData}
            localValues={localEnergyFluxValues}
            editableFields={editableEnergyFluxFields}
            onChange={(key, value) => handleChange(key, value, "energyFlux")}
            onUpdate={(field) => handleUpdate(field, "energyFlux")}
            editingField={editingField}
            setEditingField={setEditingField}
          />
        )}
      </div>
    </div>
  );
};

// ----- Reusable Components -----

interface SectionProps {
  type: string;
  title: string;
  config: any;
  hasData: boolean;
  localValues: any;
  editableFields: string[];
  onChange: (key: string, value: string) => void;
  onUpdate: (field: string) => void;
  editingField: string | null;
  setEditingField: (field: string | null) => void;
}

const Section = React.memo(
  ({
    type,
    title,
    config,
    hasData,
    localValues,
    editableFields,
    onChange,
    onUpdate,
    editingField,
    setEditingField,
  }: SectionProps) => (
    <div className="flex-1">
      <h2 className="text-lg font-bold text-neonBlue mb-4 text-center">
        {title}
      </h2>
      {config === null ? (
        <div className="text-yellow-500 text-center py-4">Data saknas</div>
      ) : hasData ? (
        <div className="flex gap-10">
          {editableFields.map((key: string) => (
            <InputField
              key={`${type}-${key}`}
              label={key.replace(/_/g, " ")}
              value={localValues[key]?.toString() ?? ""}
              onChange={(value) => onChange(key, value)}
              onSave={() => onUpdate(key)}
              onCancel={() => setEditingField(null)}
              isEditing={editingField === key}
              setEditing={() => setEditingField(key)}
            />
          ))}
        </div>
      ) : (
        <div className="text-yellow-500 text-center py-4">Loading...</div>
      )}
    </div>
  )
);

const LoadingIndicator = () => (
  <div className="text-neonBlue text-center">Loading...</div>
);

const ErrorDisplay = ({ error }: { error: string }) => (
  <div className="text-red-500 text-center">
    Error: {error || "An unknown error occurred"}
  </div>
);

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
  setEditing: () => void;
}

const InputField = React.memo(
  ({
    label,
    value,
    onChange,
    onSave,
    onCancel,
    isEditing,
    setEditing,
  }: InputFieldProps) => (
    <div className="bg-darkBgLight p-4 rounded-lg shadow-md">
      <label className="text-neonBlue font-semibold block mb-1">{label}:</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-gray-900 text-white border border-neonBlue rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neonBlue w-full"
          disabled={!isEditing}
        />
        {isEditing ? (
          <>
            <button
              className="bg-green-500 text-darkBg px-4 py-2 rounded-md font-semibold hover:bg-opacity-80 transition"
              onClick={onSave}
            >
              Save
            </button>
            <button
              className="bg-red-500 text-darkBg px-4 py-2 rounded-md font-semibold hover:bg-opacity-80 transition"
              onClick={onCancel}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            className="bg-neonBlue text-darkBg px-4 py-2 rounded-md font-semibold hover:bg-opacity-80 transition"
            onClick={setEditing}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  )
);

export default AlgoOverView;
