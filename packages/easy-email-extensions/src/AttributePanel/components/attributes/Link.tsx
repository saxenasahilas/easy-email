import React, { useMemo } from 'react';
import { useFocusIdx } from 'easy-email-editor';
import { IconLink } from '@arco-design/web-react/icon';
import { SelectField, TextField } from '../../../components/Form';
import { Grid } from '@arco-design/web-react';

export function Link() {
  const { focusIdx } = useFocusIdx();

  return useMemo(() => {
    return (
      <Grid.Row>
        <Grid.Col span={11}>
          <TextField
            prefix={<IconLink />}
            label={<span>{String('Href')}&nbsp;&nbsp;&nbsp;</span>}
            name={`${focusIdx}.attributes.href`}
          />
        </Grid.Col>
        <Grid.Col offset={1} span={11}>
          <SelectField
            label={String('Target')}
            name={`${focusIdx}.attributes.target`}
            options={[
              {
                value: '',
                label: String('_self'),
              },
              {
                value: '_blank',
                label: String('_blank'),
              },
            ]}
          />
        </Grid.Col>
      </Grid.Row>
    );
  }, [focusIdx]);
}
