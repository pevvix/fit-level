import { Button, Box, Container, Card, Text, Group, Badge } from '@mantine/core';
import { useState } from 'react'
import './App.css'

function App() {
  return (<><><header className="app-header">

    <div className='xpArea'><Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>XP 123</Text>
      </Group>
    </Card>
    </div>

    <div className='dayStreakArea'><Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>Day Streak 2</Text>
      </Group>
    </Card>
    </div>

    <div className='lvlArea'><Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>LVL.1</Text>
      </Group>
    </Card>
    </div>
  </header>
<div className='todayPlan'>
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>March 7, Monday: Gym - armday</Text>
      </Group>
    </Card>
    {/* <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>Next: March 11, Wednesday: Cardio - swimming</Text>
      </Group>
    </Card> */}

</div>
  
    <div className="buttonDone-container">
      <Button id='buttonDone' variant="filled" color="lime" size="xl" radius="xl">Done</Button>
    </div>
    
    <div className="calendar-button">
      <Button  variant="filled" color="blue" size="lg" radius="md">Calendar</Button>
    </div>
    
    <div className="setWorkout-button">
      <Button variant="filled" color="cyan" size="lg" radius="md">Set workout</Button>
    </div>
  </><div> </div></>
   
  )
}

export default App
