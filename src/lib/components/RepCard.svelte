<script lang="ts">
	import type { RepInfo } from '$lib/types/RepInfo';

	interface Props {
		rep: RepInfo;
	}

	let { rep }: Props = $props();
</script>

<div class="rep-card">
	<div class="avatar-wrapper">
		<div class="avatar">{rep.avatar}</div>
		<div class="online-indicator"></div>
	</div>
	<h2 class="rep-name">{rep.name}</h2>
	<p class="rep-title">{rep.title}</p>

	<div class="meeting-info">
		<div class="meeting-info-item">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="10" />
				<path d="M12 6v6l4 2" />
			</svg>
			<span>{rep.meetingDuration} minutes</span>
		</div>
		<div class="meeting-info-item">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M15 10l-4 4l6 6l4-16l-18 7l4 2l2 6l3-4" />
			</svg>
			<span>Video call</span>
		</div>
	</div>

	<div class="divider"></div>

	<h3 class="meeting-title">Discovery Call</h3>
	<p class="meeting-desc">
		Let's discuss how ACME can help streamline your sales process and boost your team's productivity.
	</p>
</div>

<style>
	.rep-card {
		text-align: center;
	}

	.avatar-wrapper {
		position: relative;
		display: inline-block;
		margin-bottom: 20px;
	}

	.avatar {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24px;
		font-weight: 600;
		box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
	}

	.online-indicator {
		position: absolute;
		bottom: 4px;
		right: 4px;
		width: 16px;
		height: 16px;
		background: #10b981;
		border-radius: 50%;
		border: 3px solid white;
		box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
	}

	.rep-name {
		font-family: 'Fraunces', serif;
		font-size: 22px;
		font-weight: 600;
		color: #1a1a2e;
		margin: 0 0 4px 0;
	}

	.rep-title {
		font-size: 14px;
		color: #64748b;
		margin: 0 0 24px 0;
	}

	.meeting-info {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 24px;
	}

	.meeting-info-item {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		font-size: 14px;
		color: #475569;
	}

	.divider {
		height: 1px;
		background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
		margin: 24px 0;
	}

	.meeting-title {
		font-family: 'Fraunces', serif;
		font-size: 18px;
		font-weight: 500;
		color: #1a1a2e;
		margin: 0 0 12px 0;
	}

	.meeting-desc {
		font-size: 14px;
		color: #64748b;
		line-height: 1.6;
		margin: 0;
	}
</style>
