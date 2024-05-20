export const calculatePercentageTV = (item, setItem) => {
  if (
    !item.numberCalls ||
    isNaN(item.tvDisconnection) ||
    isNaN(item.numberCalls)
  ) {
    setItem((prevState) => ({
      ...prevState,
      simurTV: "0%",
      simurTVColor: "#ad6262",
    }));
  } else if (item.numberCalls && !item.tvDisconnection) {
    setItem((prevState) => ({
      ...prevState,
      simurTV: "100%",
      simurTVColor: "#62a462",
    }));
  } else {
    const percentage =
      1 - parseFloat(item.tvDisconnection) / parseFloat(item.numberCalls);
    let color;
    if (percentage >= 0.79) {
      color = "#62a462";
    } else if (percentage >= 0.67) {
      color = "#c1c16f";
    } else {
      color = "#ad6262";
    }
    setItem((prevState) => ({
      ...prevState,
      simurTV: (percentage * 100).toFixed(2) + "%",
      simurTVColor: color,
    }));
  }
};

export const calculatePercentageFiber = (item, setItem) => {
  if (
    !item.numberCalls ||
    isNaN(item.fiberDisconnection) ||
    isNaN(item.numberCalls)
  ) {
    setItem((prevState) => ({
      ...prevState,
      simurFiber: "0%",
      simurFiberColor: "#ad6262",
    }));
  } else if (item.numberCalls && !item.fiberDisconnection) {
    setItem((prevState) => ({
      ...prevState,
      simurFiber: "100%",
      simurFiberColor: "#62a462",
    }));
  } else {
    const percentage =
      1 - parseFloat(item.fiberDisconnection) / parseFloat(item.numberCalls);
    let color;
    if (percentage >= 0.79) {
      color = "#62a462";
    } else if (percentage >= 0.67) {
      color = "#c1c16f";
    } else {
      color = "#ad6262";
    }
    setItem((prevState) => ({
      ...prevState,
      simurFiber: (percentage * 100).toFixed(2) + "%",
      simurFiberColor: color,
    }));
  }
};

export const calculatePercentageTVcreate = (formData, setFormData) => {
  if (
    !formData.numberCalls ||
    isNaN(formData.tvDisconnection) ||
    isNaN(formData.numberCalls)
  ) {
    setFormData((prevState) => ({
      ...prevState,
      simurTV: "0%",
      simurTVColor: "#ad6262",
    }));
  } else if (formData.numberCalls && !formData.tvDisconnection) {
    setFormData((prevState) => ({
      ...prevState,
      simurTV: "100%",
      simurTVColor: "#62a462",
    }));
  } else {
    const percentage =
      1 -
      parseFloat(formData.tvDisconnection) / parseFloat(formData.numberCalls);
    let color;
    if (percentage >= 0.79) {
      color = "#62a462";
    } else if (percentage >= 0.67) {
      color = "#c1c16f";
    } else {
      color = "#ad6262";
    }
    setFormData((prevState) => ({
      ...prevState,
      simurTV: (percentage * 100).toFixed(2) + "%",
      simurTVColor: color,
    }));
  }
};

export const calculatePercentageFiberCreate = (formData, setFormData) => {
  if (
    !formData.numberCalls ||
    isNaN(formData.fiberDisconnection) ||
    isNaN(formData.numberCalls)
  ) {
    setFormData((prevState) => ({
      ...prevState,
      simurFiber: "0%",
      simurFiberColor: "#ad6262",
    }));
  } else if (formData.numberCalls && !formData.fiberDisconnection) {
    setFormData((prevState) => ({
      ...prevState,
      simurFiber: "100%",
      simurFiberColor: "#62a462",
    }));
  } else {
    const percentage =
      1 -
      parseFloat(formData.fiberDisconnection) /
        parseFloat(formData.numberCalls);
    let color;
    if (percentage >= 0.79) {
      color = "#62a462";
    } else if (percentage >= 0.67) {
      color = "#c1c16f";
    } else {
      color = "#ad6262";
    }
    setFormData((prevState) => ({
      ...prevState,
      simurFiber: (percentage * 100).toFixed(2) + "%",
      simurFiberColor: color,
    }));
  }
};
