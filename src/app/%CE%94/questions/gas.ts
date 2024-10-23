//  , and steam is .  and the $\\Delta H_{\\text{fus}} = 6.02\\ \\text{kJ/mol}$
export const questions = [
  {
    question: "What quantity of energy does it take to covert $200\\ \\text{g}$ ice at $-10.0\\degree \\text{C}$ to steam at $300\\degree \\text{C}$?",
    steps: [
      {
        instruction:
          "Our ice is at $-10.0\\degree \\text{C}$ and we need it to be at $0\\degree \\text{C}$ to start the melting process. Determine how much energy this takes. The specific heat capacity of ice is $2.03\\ \\text{J/g}$",
        solution: 4.06,
        unit: "kJ",
        hint: `$q= mC \\Delta T$ maybe be helpful here`,
      },
      {
        instruction:
          "We will need to know the moles of water. Calculate it now.",
        solution: 11.1,
        unit: "mol",
        hint: "Use the molar mass of $H_2O$ ($18.02 \\text{g/mol}$)",
      },
      {
        instruction:
          "Now, find the energy required to phase change from a ice to a liquid. $\\Delta H_{\\text{fus}} = 6.02\\ \\text{kJ/mol}$",
        solution: 66.8,
        unit: "kJ",
        hint: "$q=\\Delta H_{fus} \\cdot n$ maybe be helpful here",
      },
      {
        instruction:
          "Now that we are a liquid, we must go boiling point to turn into a gas. Determine how much energy this takes. The spcific heat capacity of water is $4.18 \\ \\text{J/g} \\cdot \\degree \\text{C}$",
        solution: 83.6,
        unit: "kJ",
        hint: "$q= mC \\Delta T$",
      },
      {
        instruction:
          "Now that we are a $100\\degree \\text{C}$ liquid, determine the energy required to become a gas. $\\Delta H_{\\text{vap}} = 40.7\\ \\text{kJ/mol}$",
        solution: 451.77,
        unit: "kJ",
        hint: "$q=\\Delta H_{fus} \\cdot n$",
      },
      {
        instruction:
          "Finally, heat the gas to $300\\degree \\text{C}$. The specific heat capacity of steam is $2.02 \\ \\text{J/g} \\cdot \\degree \\text{C}$",
        solution: 1212,
        unit: "kJ",
        hint: "$q= mC \\Delta T$",
      },
      {
        instruction:
          "Add up all the energy used!",
        solution: 1829.33,
        unit: "kJ",
        hint: "Addition",
      },
    ],
  },
];
