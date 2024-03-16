const all_categories = [
  {
    id: 1,
    label: "Grass",
    checked: false,
    expand: false,
    indeterminate: false,
    extent: [],
    sub_category: [
      {
        id: 1,
        label: "Green",
        checked: false,
        expand: false,
        indeterminate: false,
        extent: [],
        category: [
          { id: 1, label: "Tall Green", checked: false, extent: [] },
          { id: 2, label: "Short Green", checked: false, extent: [] },
        ],
      },
      {
        id: 2,
        label: "Light Green",
        checked: false,
        expand: false,
        indeterminate: false,
        extent: [],
        category: [
          { id: 1, label: "Tall Light", checked: false, extent: [] },
          { id: 2, label: "Short Light", checked: false, extent: [] },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "Trees",
    checked: false,
    expand: false,
    indeterminate: false,
    extent: [],
    sub_category: [
      {
        id: 1,
        label: "Tropical",
        checked: false,
        expand: false,
        indeterminate: false,
        extent: [],
        category: [
          { id: 1, label: "Tall Tropical", checked: false, extent: [] },
          { id: 2, label: "Short Tropical", checked: false, extent: [] },
        ],
      },
      {
        id: 2,
        label: "Terrestrial",
        checked: false,
        expand: false,
        indeterminate: false,
        extent: [],
        category: [
          { id: 1, label: "Tall Terrestrial", checked: false, extent: [] },
          { id: 2, label: "Short Terrestrial", checked: false, extent: [] },
        ],
      },
    ],
  },
  {
    id: 3,
    label: "Land",
    checked: false,
    expand: false,
    indeterminate: false,
    extent: [],
    sub_category: [],
  },
];

export default all_categories;
