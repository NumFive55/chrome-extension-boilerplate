import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import * as ReactDOM from "react-dom";

import "../styles/popup.css";

const Popup = () => {
  // SET STATE FOR ACTIVE FEATURES IN STATE SETTER
  // USEEFFECT ON UPDATE OF STATE AND STORE STATE IN LOCAL STORAGE
  // ACCESS LOCAL STORAGE IN CONTENT.TS

  interface Feature {
    name: string;
    id: string;
    checked: boolean;
  }

  const allFeatures: Feature[] = [
    { name: "Test Feature", id: "testFeature", checked: false },
    { name: "Test Feature Two", id: "testFeatureTwo", checked: false },
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
        </div>
      ))}
    </div>
  );
};

// --------------

ReactDOM.render(<Popup />, document.getElementById("root"));
