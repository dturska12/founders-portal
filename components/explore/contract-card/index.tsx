import { ContractPublisher, replaceDeployerAddress } from "../publisher";
import {
  Center,
  Flex,
  Icon,
  Image,
  LinkBox,
  LinkOverlay,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { QueryClient } from "@tanstack/query-core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Polygon } from "@thirdweb-dev/chains";
import { ensQuery } from "components/contract-components/hooks";
import { getDashboardChainRpc } from "lib/rpc";
import { getEVMThirdwebSDK, replaceIpfsUrl } from "lib/sdk";
import { useMemo } from "react";
import { BsShieldCheck } from "react-icons/bs";
import { FiImage } from "react-icons/fi";
import invariant from "tiny-invariant";
import { Button, Card, Heading, Link, Text, TrackedLink } from "tw-components";

interface ContractCardProps {
  publisher: string;
  contractId: string;
  version?: string;
  slim?: boolean;
  tracking?: {
    source: string;
    itemIndex: `${number}`;
  };
}

export const ContractCard: React.FC<ContractCardProps> = ({
  publisher,
  contractId,
  version = "latest",
  slim,
  tracking,
}) => {
  const publishedContractResult = usePublishedContract(
    `${publisher}/${contractId}/${version}`,
  );

  const showSkeleton =
    publishedContractResult.isLoading ||
    publishedContractResult.isPlaceholderData;

  const href = useMemo(() => {
    let h: string;
    if (version !== "latest") {
      h = `/${publisher}/${contractId}/${version}`;
    } else {
      h = `/${publisher}/${contractId}`;
    }

    return replaceDeployerAddress(h);
  }, [contractId, publisher, version]);

  return !publishedContractResult.isLoading &&
    !publishedContractResult.data?.id ? null : (
    <LinkBox as="article" minW="300px">
      <Card
        p={0}
        role="group"
        display="flex"
        flexDirection="column"
        gap={0}
        minHeight={slim ? undefined : "170px"}
        borderColor="borderColor"
        transition="150ms border-color ease-in-out"
        _hover={{
          _dark: {
            borderColor: "blue.400",
          },
          _light: {
            borderColor: "blue.600",
          },
        }}
        h="full"
        overflow="hidden"
      >
        <Flex p={3} gap={3} flexDir="column" h="full">
          {slim ? null : (
            <Flex align="center" justify="space-between">
              <Skeleton
                boxSize={8}
                borderRadius="full"
                overflow="hidden"
                isLoaded={!showSkeleton}
              >
                {publishedContractResult.data?.logo ? (
                  <Image
                    alt={
                      publishedContractResult.data?.displayName ||
                      publishedContractResult.data?.name
                    }
                    boxSize="full"
                    src={replaceIpfsUrl(
                      publishedContractResult.data?.logo || "",
                    )}
                  />
                ) : (
                  <Center
                    boxSize="full"
                    borderWidth="1px"
                    borderColor="borderColor"
                    borderRadius="50%"
                  >
                    <Icon boxSize="50%" color="accent.300" as={FiImage} />
                  </Center>
                )}
              </Skeleton>
              <Skeleton isLoaded={!showSkeleton} borderRadius="full">
                <Button
                  size="sm"
                  variant="outline"
                  borderRadius="full"
                  borderColor="borderColor"
                  fontSize={12}
                  _groupHover={{
                    _dark: {
                      bg: "white",
                      color: "black",
                    },
                    _light: {
                      bg: "black",
                      color: "white",
                    },
                  }}
                >
                  Deploy
                </Button>
              </Skeleton>
            </Flex>
          )}

          <Flex direction="column" gap={2}>
            <Flex gap={1} align="center">
              {slim && (publishedContractResult.data?.logo || showSkeleton) && (
                <Skeleton
                  boxSize={5}
                  borderRadius="full"
                  overflow="hidden"
                  isLoaded={!showSkeleton}
                >
                  {publishedContractResult.data?.logo && (
                    <Image
                      alt={
                        publishedContractResult.data?.displayName ||
                        publishedContractResult.data?.name
                      }
                      boxSize="full"
                      src={replaceIpfsUrl(
                        publishedContractResult.data?.logo || "",
                      )}
                    />
                  )}
                </Skeleton>
              )}
              <Skeleton
                noOfLines={1}
                isLoaded={!showSkeleton}
                w={showSkeleton ? "50%" : "auto"}
              >
                <LinkOverlay
                  as={TrackedLink}
                  category="contract_card"
                  label={contractId}
                  href={href}
                  trackingProps={{
                    publisher,
                    contractId,
                    version,
                    ...(tracking || {}),
                  }}
                  _hover={{ textDecor: "none" }}
                >
                  <Heading as="h3" noOfLines={1} size="label.lg">
                    {publishedContractResult.data?.displayName ||
                      publishedContractResult.data?.name}
                  </Heading>
                </LinkOverlay>
              </Skeleton>
            </Flex>
            <SkeletonText
              isLoaded={!showSkeleton}
              spacing={3}
              noOfLines={2}
              my={showSkeleton ? 2 : 0}
            >
              <Text size="body.md" noOfLines={slim ? 1 : 2}>
                {publishedContractResult.data?.description}
              </Text>
            </SkeletonText>
          </Flex>
          <Flex
            mt="auto"
            pt={1}
            justify="space-between"
            align="center"
            as="footer"
          >
            <ContractPublisher
              addressOrEns={publishedContractResult.data?.publisher}
              showSkeleton={showSkeleton}
            />
            <Flex
              align="center"
              gap={4}
              color="rgba(255,255,255,.7)"
              _light={{ color: "rgba(0,0,0,.6)" }}
            >
              {(showSkeleton || publishedContractResult.data?.audit) && (
                <Flex
                  isExternal
                  as={Link}
                  align="center"
                  gap={0.5}
                  href={replaceIpfsUrl(
                    publishedContractResult.data?.audit || "",
                  )}
                  _hover={{
                    _dark: {
                      color: "green.300",
                    },
                    _light: {
                      color: "green.500",
                    },
                  }}
                >
                  <Skeleton boxSize={5} isLoaded={!showSkeleton}>
                    <Icon as={BsShieldCheck} />
                  </Skeleton>
                  <Skeleton isLoaded={!showSkeleton}>
                    <Text color="inherit" size="label.sm" fontWeight={500}>
                      Audited
                    </Text>
                  </Skeleton>
                </Flex>
              )}
              {(showSkeleton || publishedContractResult.data?.version) && (
                <Flex align="center" gap={0.5}>
                  <Skeleton isLoaded={!showSkeleton}>
                    <Text color="inherit" size="label.sm" fontWeight={500}>
                      v{publishedContractResult.data?.version}
                    </Text>
                  </Skeleton>
                </Flex>
              )}
            </Flex>
          </Flex>
        </Flex>
        {/* <ExtensionBar
          extensions={publishedContractResult.data?.extensions || []}
        /> */}
      </Card>
    </LinkBox>
  );
};

// data fetching
export type PublishedContractId =
  | `${string}/${string}`
  | `${string}/${string}/${string}`;

async function queryFn(
  publisher: string,
  contractId: string,
  version = "latest",
  queryClient: QueryClient,
) {
  const polygonSdk = getEVMThirdwebSDK(
    Polygon.chainId,
    getDashboardChainRpc(Polygon),
  );

  const publisherEns = await queryClient.fetchQuery(ensQuery(publisher));
  // START prefill both publisher ens variations
  if (publisherEns.address) {
    queryClient.setQueryData(
      ensQuery(publisherEns.address).queryKey,
      publisherEns,
    );
  }
  if (publisherEns.ensName) {
    queryClient.setQueryData(
      ensQuery(publisherEns.ensName).queryKey,
      publisherEns,
    );
  }
  // END prefill both publisher ens variations
  invariant(publisherEns.address, "publisher address not found");
  const latestPublishedVersion = await polygonSdk
    .getPublisher()
    .getVersion(publisherEns.address, contractId, version);
  invariant(latestPublishedVersion, "no published version found");
  const contractInfo = await polygonSdk
    .getPublisher()
    .fetchPublishedContractInfo(latestPublishedVersion);
  return {
    ...latestPublishedVersion,
    ...contractInfo.publishedMetadata,

    publishedContractId: `${publisher}/${contractId}/${version}`,
  };
}

export function publishedContractQuery(
  publishedContractId: PublishedContractId,
  queryClient: QueryClient,
) {
  const [publisher, contractId, version] = publishedContractId.split("/");
  return {
    queryKey: ["published-contract", { publisher, contractId, version }],
    queryFn: () => queryFn(publisher, contractId, version, queryClient),
    enabled: !!publisher || !!contractId,
    placeholderData: {
      publishedContractId,
      version: "0.0.0",
      name: "Loading...",
      description: "Loading...",
      publisher: "",
      audit: "",
      logo: "",
      extensions: [],
      id: "",
      metadataUri: "",
      timestamp: "",
      bytecodeUri: "",
    } as PublishedContract,
  };
}

export type PublishedContract = Awaited<ReturnType<typeof queryFn>>;

export function usePublishedContract(publishedContractId: PublishedContractId) {
  const queryClient = useQueryClient();
  return useQuery(publishedContractQuery(publishedContractId, queryClient));
}
