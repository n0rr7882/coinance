import React from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText } from '@material-ui/core';
import { Currency } from '../../models/currency-pair';
import { currencyRepository } from '../../repositories/currency';
import { boundClass } from 'autobind-decorator';

interface StartCurrencyFieldProps {
  value: number;
  onChange: (value: number) => void;
  error?: boolean;
  helperText?: React.ReactNode;
}

interface StartCurrencyFieldState {
  currencies: Currency[];
}

@boundClass
export default class StartCurrencyField extends React.Component<StartCurrencyFieldProps, StartCurrencyFieldState> {
  state: StartCurrencyFieldState = {
    currencies: [],
  }

  async componentDidMount() {
    const currencies = await currencyRepository.list({ available_for_start: true });
    this.setState({ currencies });
  }

  private onChange(e: React.ChangeEvent<HTMLInputElement>, v: string) {
    this.props.onChange(Number(v));
  }

  render() {
    return (
      <FormControl component="fieldset" error={this.props.error}>
        <FormLabel component="legend">화폐</FormLabel>
        <RadioGroup area-label="currency" name="start-currency" value={this.props.value} onChange={this.onChange}>
          {this.state.currencies.map(c => (
            <FormControlLabel
              value={c.id}
              control={<Radio color={this.props.value === c.id ? 'primary' : 'default'} />}
              label={`${c.name}(${c.symbol})`}
              labelPlacement="end"
            />
          ))}
        </RadioGroup>
        <FormHelperText>{this.props.helperText}</FormHelperText>
      </FormControl>
    );
  }
}