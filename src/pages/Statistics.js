import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Helmet } from 'react-helmet-async';
import _ from 'lodash';
import { Stack, Container, Typography, Box } from '@mui/material';
import { api } from '../constants/api';

export default function Statistics() {
  const [state, setState] = useState(null);
  function getTrainings() {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(api.trainings, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const groupedData = _.groupBy(result, 'activity');
        const tempxaxis = Object.keys(groupedData);
        const tempyaxis = tempxaxis.map((activity) => {
          const durations = _.map(groupedData[activity], 'duration');
          const sumOfDurations = _.sumBy(groupedData[activity], 'duration');
          return sumOfDurations / durations.length;
        });

        setState({
          series: [
            {
              data: tempyaxis,
            },
          ],
          options: {
            chart: {
              toolbar: {
                show: false,
              },
              type: 'bar',
              events: {
                click: (chart, w, e) => {
                  // console.log(chart, w, e)
                },
              },
            },

            fill: { colors: ['#3788d8'] },
            plotOptions: {
              bar: {
                columnWidth: '45%',
                distributed: true,
              },
            },
            dataLabels: {
              enabled: false,
            },
            legend: {
              show: false,
            },
            yaxis: {
              //  categories: [0, 25, 50, 75, 100],
              labels: {
                show: true,
                style: {
                  color: 'black',
                  fontSize: '13px',
                  //    fontWeight: 'bold',
                },
              },
              title: {
                text: 'Duration',
                style: {
                  color: 'black',
                  fontSize: '16px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 600,
                  cssClass: 'apexcharts-xaxis-title',
                  marginRight : 20
                },
              },
            },
            xaxis: {
              categories: tempxaxis,
              labels: {
                show: true,
                style: {
                  color: 'black',
                  fontSize: '13px',
                  //    fontWeight: 'bold',
                },
              },
              title: {
                text: 'Activities',
                style: {
                  color: 'black',
                  fontSize: '16px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 600,
                  cssClass: 'apexcharts-xaxis-title',
                },
              },
            },
          },
        });
      })
      .catch((error) => console.log('error', error));
  }

  useEffect(() => {
    getTrainings();
  }, []);

  return (
    <>
      <Helmet>
        <title> Statistics </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h4" gutterBottom>
            Statistics
          </Typography>
        </Stack>
        <Box>
          {state && (
            <div id="chart">
              <ReactApexChart options={state.options} series={state.series} type="bar" height={600} />
            </div>
          )}
        </Box>
      </Container>
    </>
  );
}
