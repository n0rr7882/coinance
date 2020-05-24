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

export const highlightedRowStyles = (theme: Theme) => createStyles({
  highlightedDefault: {
    transition: 'border-left 1s',
    borderLeft: `5px solid ${theme.palette.background.paper}`,
  },
  highlightedUp: {
    borderLeft: `5px solid ${theme.palette.secondary.main}`,
  },
  highlightedDown: {
    borderLeft: `5px solid ${theme.palette.primary.main}`,
  },
});