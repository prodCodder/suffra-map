export enum IETPoliticalTrends {
    far_left = "far_left",
    left = "left",
    center = "center",
    right = "right",
    far_right = "far_right",
    sovereignist = "sovereignist",
    ecologist = "ecologist",
    regionalist = "regionalist",
    various = "various"
}


export const trends = {
  [IETPoliticalTrends.far_left]: {
    label: "Extrême gauche",
    color: "#9E0B0B",
  },
  [IETPoliticalTrends.left]: {
    label: "Gauche",
    color: "#ff5d5d",
  },
  [IETPoliticalTrends.center]: {
    label: "Centriste",
    color: "#ffb847",
  },
  [IETPoliticalTrends.right]: {
    label: "Droite",
    color: "#5A72E7",
  },
  [IETPoliticalTrends.far_right]: {
    label: "Extrême droite",
    color: "#766E6B",
  },
  [IETPoliticalTrends.sovereignist]: {
    label: "Souverainiste",
    color: "#9077D5",
  },
  [IETPoliticalTrends.ecologist]: {
    label: "Écologiste",
    color: "#49D9B0",
  },
  [IETPoliticalTrends.regionalist]: {
    label: "Régionaliste",
    color: "#C9E9FF",
  },
  [IETPoliticalTrends.various]: {
    label: "Divers",
    color: "#b1b9bf",
  },
}