/**
 * This file is part of Graylog.
 *
 * Graylog is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Graylog is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Graylog.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.graylog.storage.elasticsearch6.views.export;

import org.graylog.plugins.views.search.export.ExportMessagesCommand;
import org.graylog.storage.elasticsearch6.testing.ElasticsearchInstanceES6;
import org.graylog.testing.elasticsearch.ElasticsearchInstance;
import org.junit.Rule;
import org.junit.Test;

import static org.graylog.storage.elasticsearch6.testing.TestUtils.jestClient;

public class ElasticsearchExportBackendSearchAfterIT extends ElasticsearchExportBackendITBase {
    @Rule
    public final ElasticsearchInstance elasticsearch = ElasticsearchInstanceES6.create();

    @Override
    protected ElasticsearchInstance elasticsearch() {
        return this.elasticsearch;
    }

    @Override
    protected RequestStrategy requestStrategy() {
        return new SearchAfter(new JestWrapper(jestClient(elasticsearch)));
    }

    @Test
    public void sortsByTimestampDescending() {
        importFixture("messages.json");

        ExportMessagesCommand command = commandBuilderWithAllStreams().build();

        runWithExpectedResult(command, "timestamp,source,message",
                "graylog_0, 2015-01-01T04:00:00.000Z, source-2, Ho",
                "graylog_0, 2015-01-01T03:00:00.000Z, source-1, Hi",
                "graylog_1, 2015-01-01T02:00:00.000Z, source-2, He",
                "graylog_0, 2015-01-01T01:00:00.000Z, source-1, Ha");
    }
}
