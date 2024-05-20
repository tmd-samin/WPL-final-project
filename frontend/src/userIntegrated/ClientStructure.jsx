const clientStructure = [
  {
    name: "name",
    fields: [
      {
        name: "first",
        type: "text",
        label: "First Name",
        required: true,
        block: false,
      },
      {
        name: "middle",
        type: "text",
        label: "Middle Name",
        required: true,
        block: false,
      },
      {
        name: "last",
        type: "text",
        label: "Last Name",
        required: true,
        block: false,
      },
    ],
  },
  { name: "phone", type: "text", label: "Mobile", required: true, block: false },
  {
    name: "email",
    type: "email",
    label: "Email",
    required: true,
    block: false,
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    required: true,
    block: false,
    initialOnly: true,
  },
  {
    name: "teamName",
    type: "text",
    label: "Team Name",
    required: true,
    block: false,
  },
  {
    name: "IsBusiness",
    type: "boolean",
    label: "Team Leader",
    required: true,
    block: false,
  },
  {
    name: "serviceDepartment",
    type: "boolean",
    label: "Service Department",
    required: true,
    block: false,
  },
  {
    name: "conservationDepartment",
    type: "boolean",
    label: "Conservation Department",
    required: true,
    block: false,
  },
];

export default clientStructure;
