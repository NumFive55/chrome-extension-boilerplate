import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import * as ReactDOM from "react-dom";

import "../styles/popup.css";

const Popup = () => {
  interface Feature {
    name: string;
    input: boolean;
    id: string;
    checked: boolean;
    skipSpeed?: number;
  }

  const allFeatures: Feature[] = [
    {
      name: "Test Feature",
      id: "testFeature",
      input: true,
      skipSpeed: 5,
      checked: false,
    },
    {
      name: "Test Feature Two",
      id: "testFeatureTwo",
      input: false,
      checked: false,
    },
    {
      name: "Picture-in-picture",
      id: "pictureInPicture",
      input: false,
      checked: false,
    },
  ];

  const [features, setFeatures] = useState(allFeatures);

  useEffect(() => {
    chrome.storage.sync.get("featureList", (result) => {
      setFeatures(result.featureList);
    });
  }, []);

  useEffect(() => {
    console.log("feature changed");
    chrome.storage.sync.set({ featureList: features }, () => {});
  }),
    [features];

  const featureSelected = useCallback(
    (e) => {
      // Finds index of feature selected
      const featureIndex = features.findIndex(({ id }) => id === e.target.id);

      // Sets state of feature in object
      let featuresList = [...features];
      let updatedFeature = features[featureIndex];

      // Checks state of checkbox
      if (updatedFeature.checked) {
        updatedFeature.checked = false;
      } else {
        updatedFeature.checked = true;
      }

      // Updates shallow feature list with updated feature
      featuresList[featureIndex] = updatedFeature;

      // Sets new features
      setFeatures(featuresList);
    },
    [features]
  );

  const handleInputChange = useCallback(
    (evt) => {
      const value = evt.target.value;

      const shallowFeatures = [...features];

      const objectIndex = shallowFeatures.findIndex(
        (elem) => elem.id === evt.target.id
      );

      const objectToUpdate = shallowFeatures[objectIndex];

      objectToUpdate[evt.target.name] = evt.target.value;

      shallowFeatures[objectIndex] = objectToUpdate;

      setFeatures(shallowFeatures);
    },
    [features]
  );

  return (
    <div className="popup-padded">
      {features.map((feature, index) => (
        <div key={index}>
          <h1>{feature.name}</h1>
          <input
            type="checkbox"
            id={feature.id}
            onChange={featureSelected}
            checked={feature.checked}
          ></input>
          {feature.input && (
            <input
              type="number"
              id={feature.id}
              name="skipSpeed"
              value={feature.skipSpeed}
              onChange={handleInputChange}
            ></input>
          )}
        </div>
      ))}
    </div>
  );
};

// --------------

ReactDOM.render(<Popup />, document.getElementById("root"));
