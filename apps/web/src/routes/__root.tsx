import { Outlet, createRootRoute } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import {
  Flex, Avatar, Box
} from '@radix-ui/themes';

import { Nav } from '@/components/nav'
import { UserSettings } from '@/components/userSettings'
import Bg from '@/assets/bg.svg?react';


export const Route = createRootRoute({
  component: () => (
    <>
      <Bg style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, opacity: .5 }} width="100vw" height="100vh" />
      <Flex className="h-screen" direction="column" gap="4" >
        <Flex>
          <Flex direction="column" gap="2" className="navigation" align={'center'} pb="5">
            <Flex gap="2" justify='center' m="8">
              <Avatar
                src={'https://i.pravatar.cc/128'}
                fallback={"ME"}
                size={{
                  sm: "3",
                  md: "6",
                }}
                radius="full"
                style={{ cursor: 'pointer' }}
              />
            </Flex>
            <Flex flexGrow="1">
              <Nav  />
            </Flex>
            <UserSettings
              userName="User"
              userImage="https://avatars.githubusercontent.com/u/12345678?v=4"
            />
          </Flex>

          <main className="main-content" style={{ height: "100vh", overflow: "scroll", flexGrow: 1 }}>
            <Box p="6" pt="9">
              <Outlet />
            </Box>
          </main>
        </Flex>
      </Flex>
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
})