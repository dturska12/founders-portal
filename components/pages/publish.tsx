import {
  Center,
  Divider,
  Flex,
  GridItem,
  Icon,
  Image,
  Select,
  SimpleGrid,
  Skeleton,
} from "@chakra-ui/react";
import { PREBUILT_CONTRACTS_MAP } from "@thirdweb-dev/sdk/evm";
import { DeployFormDrawer } from "components/contract-components/contract-deploy-form/drawer";
import { useAllVersions, useEns } from "components/contract-components/hooks";
import { PublishedContract } from "components/contract-components/published-contract";
import { THIRDWEB_DEPLOYER_ADDRESS } from "constants/addresses";
import { useTrack } from "hooks/analytics/useTrack";
import { replaceIpfsUrl } from "lib/sdk";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { FiChevronLeft, FiImage } from "react-icons/fi";
import { Heading, Link, Text, TrackedIconButton } from "tw-components";

export interface PublishWithVersionPageProps {
  author: string;
  contractName: string;
  version: string;
}

export const PublishWithVersionPage: React.FC<PublishWithVersionPageProps> = ({
  author,
  contractName,
  version,
}) => {
  const trackEvent = useTrack();
  const ensQuery = useEns(author);

  const router = useRouter();

  const allVersions = useAllVersions(
    ensQuery.data?.address || undefined,
    contractName,
  );

  const publishedContract = useMemo(() => {
    return (
      allVersions.data?.find((v) => v.version === version) ||
      allVersions.data?.[0]
    );
  }, [allVersions?.data, version]);

  // If this contract is published by us and is a prebuilt contract we know about, open the custom deploy form
  const prebuiltContractName =
    publishedContract?.publisher === THIRDWEB_DEPLOYER_ADDRESS
      ? Object.values(PREBUILT_CONTRACTS_MAP).find(
          (value) => value.name === contractName,
        )?.contractType
      : undefined;

  const deployContractId =
    prebuiltContractName ||
    publishedContract?.metadataUri.replace("ipfs://", "");
  return (
    <SimpleGrid columns={12} gap={{ base: 6, md: 10 }} w="full">
      <GridItem colSpan={{ base: 12, md: 8 }}>
        <Flex gap={4} alignItems="center">
          <TrackedIconButton
            variant="ghost"
            as={Link}
            // always send back to explore page
            href="/explore"
            icon={<Icon boxSize="66%" as={FiChevronLeft} />}
            category="release"
            label="back_button"
            aria-label="Back"
          />

          {publishedContract?.logo ? (
            <Image
              flexShrink={0}
              alt={publishedContract.name}
              borderRadius="full"
              src={replaceIpfsUrl(publishedContract.logo)}
              boxSize={14}
            />
          ) : (
            <Center
              flexShrink={0}
              boxSize={14}
              borderRadius="full"
              borderWidth="1px"
              borderColor="borderColor"
            >
              <Icon boxSize="50%" as={FiImage} color="accent.300" />
            </Center>
          )}

          <Skeleton isLoaded={allVersions.isSuccess}>
            <Flex direction="column" gap={2}>
              <Heading as="h1" size="title.md">
                {publishedContract?.displayName || publishedContract?.name}
              </Heading>
              <Text as="h2">{publishedContract?.description}</Text>
            </Flex>
          </Skeleton>
        </Flex>
      </GridItem>
      <GridItem colSpan={{ base: 12, md: 4 }}>
        <Flex gap={3}>
          <Select
            onChange={(e) => {
              trackEvent({
                category: "release-selector",
                action: "click",
                version_selected: e.target.value,
              });
              const pathName =
                e.target.value === allVersions.data?.[0].version
                  ? `/${author}/${contractName}`
                  : `/${author}/${contractName}/${e.target.value}`;

              router.push(pathName);
            }}
            value={version}
          >
            {(allVersions?.data || []).map(({ version: v }, idx) => (
              <option key={v} value={v}>
                {v}
                {idx === 0 ? " (latest)" : ""}
              </option>
            ))}
          </Select>
          {deployContractId && (
            <DeployFormDrawer
              contractId={deployContractId}
              contractVersion={version}
            />
          )}
        </Flex>
      </GridItem>
      <GridItem colSpan={12} display={{ base: "inherit", md: "none" }}>
        <Divider />
      </GridItem>
      {publishedContract && (
        <PublishedContract contract={publishedContract} walletOrEns={author} />
      )}
    </SimpleGrid>
  );
};
