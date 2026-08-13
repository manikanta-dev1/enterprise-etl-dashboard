import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Pipeline } from '../../services/pipelineService';
import PipelineCard from './PipelineCard';

const pipeline: Pipeline = {
	id: 1,
	name: 'Orders Warehouse',
	description: 'Loads completed orders for analytics.',
	status: 'failed',
	source: 'PostgreSQL',
	target: 'Snowflake',
	schedule: 'Every hour',
	lastRun: '2026-08-13T12:00:00Z',
	recordsProcessed: 1284320,
};

describe('PipelineCard', () => {
	it('shows pipeline metadata and failure progress', () => {
		render(<PipelineCard pipeline={pipeline} />);

		expect(screen.getByText('Orders Warehouse')).toBeInTheDocument();
		expect(screen.getByText('Loads completed orders for analytics.')).toBeInTheDocument();
		expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
		expect(screen.getByText('Snowflake')).toBeInTheDocument();
		expect(screen.getByText('Every hour')).toBeInTheDocument();
		expect(screen.getByText(new Intl.NumberFormat().format(1284320))).toBeInTheDocument();
		expect(screen.getByText('failed')).toBeInTheDocument();
		expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '68');
	});
});
