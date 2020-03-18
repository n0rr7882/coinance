import { makeStyles, Theme } from "@material-ui/core";

export const usePaperStyles = makeStyles((theme: Theme) => ({
  paper: {
    margin: theme.spacing(2),
    border: 'none',
  },
}));

export const useTitleStyles = makeStyles({
  title: {
    fontFamily: 'Orbitron',
    fontWeight: 600,
  },
});

export const useSpacerStyles = makeStyles({
  spacer: {
    flexGrow: 1,
  },
});