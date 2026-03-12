import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { handleSearchControls } from './tools/search-controls.js';
import { handleGetControl } from './tools/get-control.js';
import { handleListControls } from './tools/list-controls.js';
import { handleGetFramework } from './tools/get-framework.js';
import { handleListFrameworks } from './tools/list-frameworks.js';
import { handleCompareControls } from './tools/compare-controls.js';
import { handleGetIsoMapping } from './tools/get-iso-mapping.js';
import { handleSearchBySector } from './tools/search-by-sector.js';
import { handleAbout } from './tools/about.js';
import { handleListSources } from './tools/list-sources.js';
import { handleCheckDataFreshness } from './tools/check-data-freshness.js';

const server = new McpServer({
  name: 'swedish-standards-mcp',
  version: '1.0.0',
});

server.tool(
  'search_controls',
  'Search Swedish government cybersecurity and information security controls by keyword (Swedish or English). Covers MSB Metodstod, MSB Grundlaggande, DIGG Digital Sakerhet, MSBFS 2020, SAPO Sakerhetsskydd, and CERT-SE recommendations.',
  {
    query: z.string().describe('Search query in Swedish or English'),
    framework_id: z.string().optional().describe('Filter by framework ID (e.g. "msb-metodstod", "cert-se-rekommendationer")'),
    category: z.string().optional().describe('Filter by control category'),
    language: z.enum(['sv', 'en']).optional().describe('Language preference for results'),
    limit: z.number().optional().describe('Maximum number of results to return'),
    offset: z.number().optional().describe('Number of results to skip for pagination'),
  },
  async (args) => handleSearchControls(args),
);

server.tool(
  'get_control',
  'Retrieve a specific Swedish security control by its unique ID, including full text, implementation guidance, and framework metadata.',
  {
    control_id: z.string().describe('Unique identifier of the control (e.g. "msb-metodstod:L1", "cert-se-rekommendationer:CSE-1")'),
  },
  async (args) => handleGetControl(args),
);

server.tool(
  'list_controls',
  'List all controls in a specified Swedish security framework, with optional filtering by category or level.',
  {
    framework_id: z.string().describe('Framework to list controls from (e.g. "msb-metodstod", "msbfs-2020")'),
    category: z.string().optional().describe('Filter by category within the framework'),
    level: z.string().optional().describe('Filter by control level or tier'),
    language: z.string().optional().describe('Language preference for result labels'),
    limit: z.number().optional().describe('Maximum number of controls to return'),
    offset: z.number().optional().describe('Number of controls to skip for pagination'),
  },
  async (args) => handleListControls(args),
);

server.tool(
  'get_framework',
  'Retrieve metadata for a specific Swedish security framework: name, version, issuing body, scope, and summary statistics.',
  {
    framework_id: z.string().describe('Framework identifier (e.g. "msb-metodstod", "sapo-sakerhetsskydd")'),
  },
  async (args) => handleGetFramework(args),
);

server.tool(
  'list_frameworks',
  'List all Swedish security and information security frameworks available in this MCP server, including MSB Metodstod, MSB Grundlaggande, DIGG, MSBFS 2020, SAPO, and CERT-SE.',
  {},
  async () => handleListFrameworks(),
);

server.tool(
  'compare_controls',
  'Compare how a security topic is addressed across multiple Swedish frameworks simultaneously. Returns matching controls from each specified framework for the given query.',
  {
    query: z.string().describe('Security topic or requirement to compare across frameworks'),
    framework_ids: z.array(z.string()).describe('List of framework IDs to compare (e.g. ["msb-metodstod", "msbfs-2020"])'),
  },
  async (args) => handleCompareControls(args),
);

server.tool(
  'get_iso_mapping',
  'Find Swedish framework controls that map to a given ISO 27001/27002 control reference. Returns MSB, DIGG, MSBFS, SAPO, and CERT-SE controls aligned to the specified ISO control.',
  {
    iso_control: z.string().describe('ISO 27001/27002 control reference (e.g. "5.1", "8.24")'),
  },
  async (args) => handleGetIsoMapping(args),
);

server.tool(
  'search_by_sector',
  'Search Swedish security controls relevant to a specific sector (e.g. government, digital_infrastructure). Optionally narrow results with a keyword query.',
  {
    sector: z.string().describe('Target sector (e.g. "government", "digital_infrastructure")'),
    query: z.string().optional().describe('Optional keyword query to narrow results within the sector'),
  },
  async (args) => handleSearchBySector(args),
);

server.tool(
  'about',
  'Return a description of this MCP server: what it covers, which Swedish security frameworks are included, data sources, and usage guidance.',
  {},
  async () => handleAbout(),
);

server.tool(
  'list_sources',
  'List all primary data sources used in this MCP server, including source URLs, issuing organisations, version numbers, and last-updated dates for each Swedish security framework.',
  {},
  async () => handleListSources(),
);

server.tool(
  'check_data_freshness',
  'Check whether the embedded Swedish security framework data is current. Returns the last-updated date for each framework and flags any sources that may be outdated.',
  {},
  async () => handleCheckDataFreshness(),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error('Fatal error starting swedish-standards-mcp:', err);
  process.exit(1);
});
