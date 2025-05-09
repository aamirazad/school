//  , and steam is .  and the $\\Delta H_{\\text{fus}} = 6.02\\ \\text{kJ/mol}$
export const questions = [
  {
    question:
      "What quantity of energy does it take to covert $200\\ \\text{g}$ ice at $-10.0\\degree \\text{C}$ to steam at $300\\degree \\text{C}$?",
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
          "Right now, we have ice, and we need it to become a liquid. Type the number of the correct statement. 1: As the ice melts, covalent bonds between hydrogen and oxygen atoms are broken, resulting in liquid water. 2: The dipole-dipole forces between water molecules strengthen during melting, causing the ice to form liquid water. 3: The hydrogen bonds between water molecules weaken as the ice absorbs energy, allowing the structure to break and form a liquid.",
        solution: 3,
        unit: "#",
        hint: "Think IMFs",
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
        solution: 451.8,
        unit: "kJ",
        hint: "$q=\\Delta H_{fus} \\cdot n$",
      },
      {
        instruction:
          "Finally, heat the gas to $300\\degree \\text{C}$. The specific heat capacity of steam is $2.02 \\ \\text{J/g} \\cdot \\degree \\text{C}$",
        solution: 80.8,
        unit: "kJ",
        hint: "$q= mC \\Delta T$",
      },
      {
        instruction: "Add up all the energy used!",
        solution: 687,
        unit: "kJ",
        hint: "Addition",
      },
    ],
  },
  {
    question:
      "A container holds 0.5 mol of an ideal gas at a pressure of 1.0 atm and a temperature of 300 K. You then heat the gas to 600 K, causing the volume to expand. If the pressure remains constant, what will the final volume of the gas be?",
    steps: [
      {
        instruction: "Find the initial volume $V_1$",
        solution: 12.309,
        unit: "L",
        hint: "$PV=nRT$",
      },
      {
        instruction: "Find the final volume",
        solution: 24.618,
        unit: "L",
        hint: "$\\frac{V_1}{T_1} = \\frac{V_2}{T_2}$",
      },
    ],
  },
  {
    question:
      "You need to prepare a sodium chloride (NaCl) solution. You dissolve 58.44 g of NaCl (molar mass 58.44 g/mol) into enough water to make 500 mL of solution. What is the molarity of the NaCl solution?",
    steps: [
      {
        instruction: "Calculate the moles of NaCl",
        solution: 1,
        unit: "mol",
        hint: "NaCl's molar mass is 58.44 g/mol",
      },
      {
        instruction: "Convert the volume of the solution to liters",
        solution: 0.5,
        unit: "mL",
        hint: "1L has 1000mL",
      },
      {
        instruction: "Calculate the molarity",
        solution: 2,
        unit: "M",
        hint: "$M = \\frac{mol}{L}$",
      },
    ],
  },
];
