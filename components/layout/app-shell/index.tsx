import { ConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { Box, Container, Divider, Flex, Icon, Stack } from "@chakra-ui/react";
import { Ethereum, Solana } from "@thirdweb-dev/chain-icons";
import { CmdKSearch } from "components/cmd-k-search";
import { ColorModeToggle } from "components/color-mode/color-mode-toggle";
import { Logo } from "components/logo";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { FiFile, FiGlobe, FiHelpCircle } from "react-icons/fi";
import {
  Button,
  Heading,
  Link,
  LinkButton,
  Text,
  TrackedLink,
} from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";

export interface AppShellProps {
  layout?: "custom-contract";
  ecosystem?: "evm" | "solana" | "either";
  noSEOOverride?: boolean;
}

export const AppShell: ComponentWithChildren<AppShellProps> = ({
  children,
  layout,
  ecosystem = "either",
  noSEOOverride,
}) => {
  const { pathname, route } = useRouter();

  const isCustomContractLayout = layout === "custom-contract";
  return (
    <Flex
      minH="calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))"
      position="relative"
      overflow="hidden"
      backgroundColor="backgroundBody"
    >
      {!noSEOOverride && (
        <NextSeo
          title="Dashboard"
          openGraph={{
            title: "Dashboard | thirdweb",
            url: `https://thirdweb.com/dashboard`,
          }}
        />
      )}
      <Flex
        transition="margin 350ms ease"
        zIndex="docked"
        width="100%"
        flexGrow={1}
        flexShrink={0}
        flexDir="column"
        overflowY="auto"
        id="tw-scroll-container"
      >
        <Box
          background="backgroundHighlight"
          zIndex="banner"
          shadow={isCustomContractLayout ? undefined : "sm"}
          position={isCustomContractLayout ? undefined : "sticky"}
          top={isCustomContractLayout ? undefined : 0}
          borderColor="borderColor"
          borderBottomWidth={isCustomContractLayout ? 0 : 1}
        >
          <Container
            maxW="container.page"
            display="flex"
            py={2}
            as="header"
            alignItems="center"
          >
            <Flex align="center" gap={4}>
              <Link href="/dashboard">
                <Logo hideWordmark />
              </Link>
              <CmdKSearch />
            </Flex>
            <Flex align="center" gap={2} marginLeft="auto">
              <Button
                as={TrackedLink}
                variant="link"
                href="/explore"
                category="header"
                label="docs"
                flexDir="row"
                gap={1.5}
                mx={1}
                alignItems="center"
                display={{ base: "none", md: "flex" }}
              >
                <Icon as={FiGlobe} />
                <Heading
                  display={{ base: "none", md: "inline-flex" }}
                  as="h4"
                  size="label.md"
                >
                  Explore
                </Heading>
              </Button>
              <Button
                as={TrackedLink}
                variant="link"
                href="https://portal.thirdweb.com"
                isExternal
                category="header"
                label="docs"
                flexDir="row"
                gap={1.5}
                mx={1}
                alignItems="center"
                display={{ base: "none", md: "flex" }}
              >
                <Icon as={FiFile} />
                <Heading
                  as="h4"
                  size="label.md"
                  display={{ base: "none", md: "inline-flex" }}
                >
                  Docs
                </Heading>
              </Button>
              <Button
                as={TrackedLink}
                variant="link"
                href="https://support.thirdweb.com"
                isExternal
                category="header"
                label="support"
                flexDir="row"
                gap={1.5}
                mx={1}
                alignItems="center"
                display="flex"
              >
                <Icon as={FiHelpCircle} />
                <Heading
                  as="h4"
                  size="label.md"
                  display={{ base: "none", md: "inline-flex" }}
                >
                  Support
                </Heading>
              </Button>

              <ColorModeToggle />
              <ConnectWallet
                ml={{ base: 0, md: 2 }}
                colorScheme="blue"
                ecosystem={ecosystem}
              />
            </Flex>
          </Container>
          <Container
            maxW="container.page"
            display="flex"
            py={2}
            as="nav"
            alignItems="center"
            overflowX={{ base: "auto", md: "hidden" }}
          >
            <Flex gap={{ base: 0, md: 2 }}>
              <LinkButton
                href="/dashboard"
                size="sm"
                variant={pathname === "/dashboard" ? "solid" : "ghost"}
              >
                Home
              </LinkButton>
              <LinkButton
                leftIcon={<Icon as={Ethereum} />}
                href="/dashboard/contracts"
                size="sm"
                variant={
                  pathname === "/dashboard/contracts" ||
                  route === "/[networkOrAddress]/[...catchAll]"
                    ? "solid"
                    : "ghost"
                }
              >
                Contracts
              </LinkButton>
              <LinkButton
                leftIcon={<Icon as={Solana} />}
                href="/dashboard/programs"
                size="sm"
                variant={
                  pathname === "/dashboard/programs" ||
                  route === "/[networkOrAddress]/[...catchAll]"
                    ? "solid"
                    : "ghost"
                }
              >
                Programs
              </LinkButton>
              <LinkButton
                href="/dashboard/storage"
                size="sm"
                variant={pathname === "/dashboard/storage" ? "solid" : "ghost"}
              >
                Storage
              </LinkButton>
              <LinkButton
                href="/dashboard/rpc"
                size="sm"
                variant={pathname === "/dashboard/rpc" ? "solid" : "ghost"}
              >
                RPC
              </LinkButton>
            </Flex>
          </Container>
        </Box>
        {isCustomContractLayout ? (
          <Box as="main" flexGrow={1}>
            {children}
          </Box>
        ) : (
          <Container flexGrow={1} as="main" maxW="container.page" py={8}>
            {children}
          </Container>
        )}

        <Container
          as="footer"
          maxW="container.page"
          w="100%"
          py={4}
          mt={{ base: 12, md: 24 }}
        >
          <Stack>
            <Divider mb={4} />
            <Flex direction="column" gap={4}>
              <Flex
                direction={{ base: "column", md: "row" }}
                gap={4}
                align="center"
                justify="center"
              >
                <Flex align="center" justify="center" gap={4}>
                  <TrackedLink
                    isExternal
                    href="https://feedback.thirdweb.com"
                    category="footer"
                    label="feedback"
                  >
                    Feedback
                  </TrackedLink>
                  <TrackedLink
                    isExternal
                    href="/privacy"
                    category="footer"
                    label="privacy"
                  >
                    Privacy Policy
                  </TrackedLink>
                  <TrackedLink
                    isExternal
                    href="/tos"
                    category="footer"
                    label="terms"
                  >
                    Terms of Service
                  </TrackedLink>

                  <TrackedLink
                    href="/gas"
                    bg="transparent"
                    category="footer"
                    display={{ base: "none", md: "flex" }}
                    label="gas-estimator"
                  >
                    Gas Estimator
                  </TrackedLink>
                  <TrackedLink
                    href="/chains"
                    bg="transparent"
                    category="footer"
                    display={{ base: "none", md: "flex" }}
                    label="chains"
                  >
                    Chainlist
                  </TrackedLink>
                  <Text alignSelf="center" order={{ base: 2, md: 0 }}>
                    thirdweb &copy; {new Date().getFullYear()}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Stack>
        </Container>
      </Flex>
    </Flex>
  );
};
