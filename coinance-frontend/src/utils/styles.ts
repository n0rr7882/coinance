import { makeStyles, Theme, createStyles } from "@material-ui/core";

export const useContainerStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(1),
  },
}));

export const usePaperStyles = makeStyles((theme: Theme) => ({
  paper: {
    margin: theme.spacing(1),
    border: `1px solid ${theme.palette.primary.main}`
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
      ? theme.palette.primary.light
      : theme.palette.primary.dark,
  },
  highlightedDown: {
    background: theme.palette.type === 'light'
      ? theme.palette.secondary.light
      : theme.palette.secondary.dark,
  },
  highlightedNormal: {
    background: theme.palette.background.default,
  },
});