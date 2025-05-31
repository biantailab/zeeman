import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import useAppStore from './store.ts';

const group_01_symbols: string[] = ["H", "Li", "Na", "K", "Rb", "Cs", "Fr"];
const group_02_symbols: string[] = ["Be", "Mg", "Ca", "Sr", "Ba", "Ra"];
const group_03_symbols: string[] = ["Sc", "Y"];
const group_04_symbols: string[] = ["Ti", "Zr", "Hf", "Rf", "La", "Ac"];
const group_05_symbols: string[] = ["V", "Nb", "Ta", "Db", "Ce", "Th"];
const group_06_symbols: string[] = ["Cr", "Mo", "W", "Sg", "Pr", "Pa"];
const group_07_symbols: string[] = ["Mn", "Tc", "Re", "Bh", "Nd", "U"];
const group_08_symbols: string[] = ["Fe", "Ru", "Os", "Hs", "Pm", "Np"];
const group_09_symbols: string[] = ["Co", "Rh", "Ir", "Mt", "Sm", "Pu"];
const group_10_symbols: string[] = ["Ni", "Pd", "Pt", "Ds", "Eu", "Am"];
const group_11_symbols: string[] = ["Cu", "Ag", "Au", "Rg", "Gd", "Cm"];
const group_12_symbols: string[] = ["Zn", "Cd", "Hg", "Cn", "Tb", "Bk"];
const group_13_symbols: string[] = ["B", "Al", "Ga", "In", "Tl", "Nh", "Dy", "Cf"];
const group_14_symbols: string[] = ["C", "Si", "Ge", "Sn", "Pb", "Fl", "Ho", "Es"];
const group_15_symbols: string[] = ["N", "P", "As", "Sb", "Bi", "Mc", "Er", "Fm"];
const group_16_symbols: string[] = ["O", "S", "Se", "Te", "Po", "Lv", "Tm", "Md"];
const group_17_symbols: string[] = ["F", "Cl", "Br", "I", "At", "Ts", "Yb", "No"];
const group_18_symbols: string[] = ["He", "Ne", "Ar", "Kr", "Xe", "Rn", "Og", "Lu", "Lr"];

interface ElementButtonProps {
  symbol: string
  invisible?: boolean
  xs?: number;
  sm?: number;
}

function ElementButton({ symbol, invisible, xs = 1, sm = 1 } : ElementButtonProps) {
  const { selected, selectElement } = useAppStore();

  const StyledButton = styled(Button)({
    borderRadius: "8px",
    border: "1px solid ",
    textTransform: "inherit",
    cursor: "pointer",
    transition: "border-color 0.25s",
    '&:hover': {
      borderColor: "#646cff",
    },
    // Can I avoid this duplication?
    '&:focus': {
      outline: "4px auto -webkit-focus-ring-color",
    },
    '&:focusVisible': {
      outline: "4px auto -webkit-focus-ring-color",
    }
  })

  return(
    <Grid
      sx={{
        visibility: (invisible) ? "hidden" : "inherit",
        flexBasis: { xs: `${(xs / 12) * 100}%`, sm: `${(sm / 12) * 100}%` },
        maxWidth: { xs: `${(xs / 12) * 100}%`, sm: `${(sm / 12) * 100}%` },
      }}
    >
      <StyledButton
        size="small"
        color={(symbol==selected.symbol) ? 'primary': 'inherit'}
        onClick={() => {
          selectElement(symbol);
        }}>
        { symbol }
      </StyledButton>
    </Grid>
  )
}

interface GroupProps {
  symbols: string[]
  offset?: number
}

function Group({ symbols, offset }: GroupProps) {
  const invisible_buttons = (() => {
    if (offset != undefined && offset > 0 && offset < 10) {
      return(
        Array
          .from(Array(offset).keys()) // Define a range of numbers to map
          .map((_, idx) => <ElementButton symbol={idx.toString()} invisible
                                          key={idx.toString()}></ElementButton>)
      )
    }
  })();

  const buttons = symbols
    .map(el => <ElementButton key={el} symbol={el}></ElementButton>);

  return(
    <Grid container direction="column" spacing={1}>
      {invisible_buttons}
      {buttons}
    </Grid>
  )
}

function PeriodicTableGrid() {
  // Special treatment for lanthanides and actinides
  const invisible_buttons = Array
    .from(Array(3).keys())
    .map((_, idx) => <ElementButton key={idx.toString()} invisible symbol={"."}></ElementButton>);

  // (Keys aren't actually mandatory in the following groups)
  return (
    <Box>
      <Grid container spacing={1} columns={{ xs: 12, sm: 12, md: 18 }} justifyContent="center">
        <Group key="Group01" symbols={group_01_symbols}></Group>
        <Group key="Group02" symbols={group_02_symbols} offset={1}></Group>
        <Group key="Group03" symbols={group_03_symbols} offset={3}></Group>
        <Group key="Group04" symbols={group_04_symbols} offset={3}></Group>
        <Group key="Group05" symbols={group_05_symbols} offset={3}></Group>
        <Group key="Group06" symbols={group_06_symbols} offset={3}></Group>
        <Group key="Group07" symbols={group_07_symbols} offset={3}></Group>
        <Group key="Group08" symbols={group_08_symbols} offset={3}></Group>
        <Group key="Group09" symbols={group_09_symbols} offset={3}></Group>
        <Group key="Group10" symbols={group_10_symbols} offset={3}></Group>
        <Group key="Group11" symbols={group_11_symbols} offset={3}></Group>
        <Group key="Group12" symbols={group_12_symbols} offset={3}></Group>
        <Group key="Group13" symbols={group_13_symbols} offset={1}></Group>
        <Group key="Group14" symbols={group_14_symbols} offset={1}></Group>
        <Group key="Group15" symbols={group_15_symbols} offset={1}></Group>
        <Group key="Group16" symbols={group_16_symbols} offset={1}></Group>
        <Group key="Group17" symbols={group_17_symbols} offset={1}></Group>
        <Group key="Group18" symbols={group_18_symbols}></Group>
      </Grid>

      <Box sx={{ height: ".5rem" }}></Box>
      <Grid container spacing={1} justifyContent="center">
        <Grid container direction='row' spacing={1}>
          {invisible_buttons}
        </Grid>
        <Grid container direction='row' spacing={1}>
          {invisible_buttons}
        </Grid>
      </Grid>
    </Box>
  )
}

export default PeriodicTableGrid;
