import { makeStyles, Theme, createStyles } from "@material-ui/core";

export const usePaperStyles = makeStyles((theme: Theme) => ({
  paper: {
    margin: theme.spacing(2),
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

export const useHighlightedRowStyles = (theme: Theme) => createStyles({
  highlightedDefault: {
    transition: 'background 0.75s',
    background: theme.palette.background.paper,
  },
  highlightedUp: {
    background: theme.palette.type === 'light'
      ? theme.palette.secondary.light
      : theme.palette.secondary.dark,
  },
  highlightedDown: {
    background: theme.palette.type === 'light'
      ? theme.palette.primary.light
      : theme.palette.primary.dark,
  },
});